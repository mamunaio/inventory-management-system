<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('customer')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::all(),
            'products' => Product::where('stock', '>', 0)->get()
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
                if ($product->stock < $item['quantity']) {
                    return back()->withErrors(['message' => 'Not enough stock for ' . $product->name]);
                }
                $product->stock -= $item['quantity'];
                $product->save();

                $item['cost_price'] = $product->cost_price ?? 0;
                $itemsWithCost[] = $item;
            }
        }
        $validated['items'] = $itemsWithCost;

        $validated['order_number'] = 'ORD-' . strtoupper(uniqid());
        $validated['status'] = 'Completed';
        $validated['user_id'] = auth()->id();

        Order::create($validated);

        return redirect()->route('orders.index')->with('success', 'Order created successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Completed,Cancelled,Refunded'
        ]);

        $order = Order::findOrFail($id);
        
        // Stock restoration logic for Cancelled or Refunded
        if (in_array($validated['status'], ['Cancelled', 'Refunded']) && !in_array($order->status, ['Cancelled', 'Refunded'])) {
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

        return back()->with('success', 'Order status updated.');
    }

    public function downloadInvoice($id)
    {
        $order = Order::with('customer')->findOrFail($id);
        
        $pdf = Pdf::loadView('invoices.template', ['order' => $order]);
        
        return $pdf->download('Invoice_' . $order->order_number . '.pdf');
    }
}
