<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Setting;
use App\Services\ActivityLogService;
use App\Services\ShopifySyncService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('customer')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::all(),
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        // Process stock reduction and capture cost price
        $itemsWithCost = [];
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $userBranchId = auth()->user()->branch_id;
                
                // Determine which stock to deduct from
                if ($userBranchId) {
                    $branchStocks = $product->branch_stocks ?? [];
                    $branchIndex = collect($branchStocks)->search(fn($b) => $b['branch_id'] === $userBranchId);
                    
                    if ($branchIndex === false || $branchStocks[$branchIndex]['stock'] < $item['quantity']) {
                        return back()->withErrors(['message' => 'Not enough stock in your branch for '.$product->name]);
                    }
                    
                    $branchStocks[$branchIndex]['stock'] -= $item['quantity'];
                    $product->branch_stocks = $branchStocks;
                    $product->save();
                } else {
                    if ($product->stock < $item['quantity']) {
                        return back()->withErrors(['message' => 'Not enough stock for '.$product->name]);
                    }
                    $product->stock -= $item['quantity'];
                    $product->save();
                }

                $product->save();
                ShopifySyncService::syncInventory($product);

                // Auto-Reorder logic (based on total company stock)
                $branchTotal = collect($product->branch_stocks ?? [])->sum('stock');
                $totalStock = ($product->stock ?? 0) + ($product->warehouse_stock ?? 0) + $branchTotal;
                $threshold = $product->low_stock_threshold ?? 10;
                
                if ($totalStock < $threshold) {
                    $existingDraft = Purchase::where('product_id', $product->id)
                        ->where('status', 'Draft')
                        ->first();
                        
                    if (!$existingDraft && $product->supplier_id) {
                        Purchase::create([
                            'supplier_id' => $product->supplier_id,
                            'product_id' => $product->id,
                            'purchase_number' => 'PO-' . strtoupper(uniqid()),
                            'quantity' => $threshold * 2,
                            'unit_cost' => $product->cost_price ?? 0,
                            'total_cost' => ($threshold * 2) * ($product->cost_price ?? 0),
                            'status' => 'Draft'
                        ]);
                    }
                }

                $item['cost_price'] = $product->cost_price ?? 0;
                $itemsWithCost[] = $item;
            }
        }
        $validated['items'] = $itemsWithCost;

        $validated['order_number'] = 'ORD-'.strtoupper(uniqid());
        $validated['status'] = 'Completed';
        $validated['user_id'] = auth()->id();
        $validated['branch_id'] = auth()->user()->branch_id;
        
        $commissionRate = auth()->user()->commission_rate ?? 0;
        $validated['commission_amount'] = ($commissionRate / 100) * $validated['total_amount'];

        Order::create($validated);
        ActivityLogService::log('order_created', "Created order: {$validated['order_number']} - $".number_format($validated['total_amount'], 2), ['order_number' => $validated['order_number'], 'total' => $validated['total_amount']]);

        return redirect()->route('orders.index')->with('success', 'Order created successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Completed,Cancelled,Refunded',
        ]);

        $order = Order::findOrFail($id);

        // Stock restoration logic for Cancelled or Refunded
        if (in_array($validated['status'], ['Cancelled', 'Refunded']) && ! in_array($order->status, ['Cancelled', 'Refunded'])) {
            foreach ($order->items as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->stock += $item['quantity'];
                    $product->save();
                }
            }
        }

        $order->status = $validated['status'];
        $order->save();
        $statusAction = strtolower($validated['status'] === 'Completed' ? 'order_completed' : ($validated['status'] === 'Cancelled' ? 'order_cancelled' : 'order_updated'));
        ActivityLogService::log($statusAction, "Order {$order->order_number} status changed to {$validated['status']}", ['order_number' => $order->order_number, 'new_status' => $validated['status']]);

        return back()->with('success', 'Order status updated.');
    }

    public function downloadInvoice($id)
    {
        $order = Order::with('customer')->findOrFail($id);
        $settings = Setting::pluck('value', 'key')->toArray();

        $pdf = Pdf::loadView('invoices.template', [
            'order' => $order,
            'settings' => $settings,
        ]);

        return $pdf->download('invoice_'.$order->order_number.'.pdf');
    }

    public function receipt($id)
    {
        $order = Order::with('customer')->findOrFail($id);
        $settings = Setting::pluck('value', 'key')->toArray();

        return view('invoices.receipt', compact('order', 'settings'));
    }
}
