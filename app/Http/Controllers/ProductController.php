<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\ActivityLogService;
use App\Services\ShopifySyncService;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        $branches = \App\Models\Branch::all();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku',
            'category' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|string',
            'barcode' => 'nullable|string',
            'description' => 'nullable|string',
            'cost_price' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'warehouse_stock' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if (empty($validated['barcode'])) {
            $validated['barcode'] = mt_rand(100000000000, 999999999999); // Auto generate 12 digit EAN
        }

        $validated['warehouse_stock'] = $validated['warehouse_stock'] ?? 0;
        $validated['low_stock_threshold'] = $validated['low_stock_threshold'] ?? 10;
        $validated['batches'] = [];

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $validated['user_id'] = auth()->id();
        Product::create($validated);
        ActivityLogService::log('product_created', "Created product: {$validated['name']}", ['product_name' => $validated['name']]);

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,'.$id.',_id',
            'category' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|string',
            'barcode' => 'nullable|string',
            'description' => 'nullable|string',
            'cost_price' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'warehouse_stock' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);
        ActivityLogService::log('product_updated', "Updated product: {$product->name}", ['product_name' => $product->name]);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        ActivityLogService::log('product_deleted', "Deleted product: {$product->name}", ['product_name' => $product->name]);

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }

    public function printBarcode($id)
    {
        $product = Product::findOrFail($id);

        // We will generate 21 labels per page (3 columns x 7 rows)
        $labelsCount = 21;

        $pdf = Pdf::loadView('barcodes.template', [
            'product' => $product,
            'count' => $labelsCount,
        ]);

        return $pdf->download('barcode_'.$product->sku.'.pdf');
    }

    public function transferStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
            'direction' => 'required|string|in:warehouse_to_store,store_to_warehouse',
            'target_branch_id' => 'nullable|string', // If null, means HQ Store
        ]);

        $qty = $validated['quantity'];
        $branchId = $validated['target_branch_id'] ?? null;
        $branchStocks = $product->branch_stocks ?? [];
        $branchIndex = false;

        if ($branchId) {
            $branchIndex = collect($branchStocks)->search(fn($b) => $b['branch_id'] === $branchId);
        }

        if ($validated['direction'] === 'warehouse_to_store') {
            if (($product->warehouse_stock ?? 0) < $qty) {
                return back()->withErrors(['message' => 'Not enough stock in warehouse.']);
            }
            $product->warehouse_stock -= $qty;
            
            if ($branchId) {
                if ($branchIndex === false) {
                    $branchStocks[] = ['branch_id' => $branchId, 'stock' => $qty];
                } else {
                    $branchStocks[$branchIndex]['stock'] += $qty;
                }
                $product->branch_stocks = $branchStocks;
            } else {
                $product->stock += $qty;
            }
        } else {
            // store_to_warehouse
            if ($branchId) {
                if ($branchIndex === false || $branchStocks[$branchIndex]['stock'] < $qty) {
                    return back()->withErrors(['message' => 'Not enough stock in branch.']);
                }
                $branchStocks[$branchIndex]['stock'] -= $qty;
                $product->branch_stocks = $branchStocks;
            } else {
                if (($product->stock ?? 0) < $qty) {
                    return back()->withErrors(['message' => 'Not enough stock in HQ store.']);
                }
                $product->stock -= $qty;
            }
            $product->warehouse_stock = ($product->warehouse_stock ?? 0) + $qty;
        }

        $product->save();
        ShopifySyncService::syncInventory($product);
        ActivityLogService::log('stock_transfer', "Transferred {$qty} units of {$product->name} ({$validated['direction']})", ['product_name' => $product->name, 'direction' => $validated['direction'], 'branch_id' => $branchId]);

        return back()->with('success', 'Stock transferred successfully.');
    }

    public function updateBatches(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'batches' => 'array',
            'batches.*.batch_number' => 'required|string',
            'batches.*.quantity' => 'required|integer|min:0',
            'batches.*.expiry_date' => 'required|date',
        ]);

        $product->batches = $validated['batches'] ?? [];
        $product->save();

        ActivityLogService::log('product_updated', "Updated batches for {$product->name}", ['product_name' => $product->name]);

        return back()->with('success', 'Batches updated successfully.');
    }
}
