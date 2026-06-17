<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Supplier;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['supplier', 'product'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::all(),
            'products' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|string',
            'product_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
        ]);

        $validated['purchase_number'] = 'PO-' . strtoupper(uniqid());
        $validated['status'] = 'Received';
        
        Purchase::create($validated);

        // Auto Restock!
        $product = Product::findOrFail($validated['product_id']);
        $product->stock += $validated['quantity'];
        $product->save();

        return redirect()->route('purchases.index')->with('success', 'Purchase recorded and stock updated.');
    }
}
