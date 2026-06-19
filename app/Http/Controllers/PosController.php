<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\ActivityLogService;

class PosController extends Controller
{
    public function index()
    {
        return Inertia::render('POS/Terminal', [
            'customers' => Customer::all(),
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'reward_points_used' => 'nullable|integer|min:0',
        ]);

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

                // Auto-Reorder logic (based on total company stock)
                $branchTotal = collect($product->branch_stocks ?? [])->sum('stock');
                $totalStock = ($product->stock ?? 0) + ($product->warehouse_stock ?? 0) + $branchTotal;
                $threshold = $product->low_stock_threshold ?? 10;
                
                if ($totalStock < $threshold) {
                    // Check if there's already a draft PO for this product to avoid duplicates
                    $existingDraft = Purchase::where('product_id', $product->id)
                        ->where('status', 'Draft')
                        ->first();
                        
                    if (!$existingDraft && $product->supplier_id) {
                        Purchase::create([
                            'supplier_id' => $product->supplier_id,
                            'product_id' => $product->id,
                            'purchase_number' => 'PO-' . strtoupper(uniqid()),
                            'quantity' => $threshold * 2, // Default reorder amount
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

        $validated['discount_amount'] = $validated['discount_amount'] ?? 0;
        $validated['reward_points_used'] = $validated['reward_points_used'] ?? 0;
        
        // Calculate Due
        $dueAmount = $validated['total_amount'] - $validated['paid_amount'];
        $validated['due_amount'] = $dueAmount > 0 ? $dueAmount : 0;

        $validated['order_number'] = 'POS-'.strtoupper(uniqid());
        $validated['status'] = $validated['due_amount'] > 0 ? 'Partial' : 'Completed';
        $validated['user_id'] = auth()->id();
        $validated['branch_id'] = auth()->user()->branch_id;
        
        $commissionRate = auth()->user()->commission_rate ?? 0;
        $validated['commission_amount'] = ($commissionRate / 100) * $validated['total_amount'];

        $order = Order::create($validated);
        
        // Customer Updates
        if (!empty($validated['customer_id'])) {
            $customer = Customer::find($validated['customer_id']);
            if ($customer) {
                // Update Due
                if ($validated['due_amount'] > 0) {
                    $customer->total_due = ($customer->total_due ?? 0) + $validated['due_amount'];
                }

                // Reward Points: Earn 1 point per $10 spent (based on total_amount paid)
                // Deduct used points
                $pointsEarned = floor($validated['total_amount'] / 10);
                $customer->reward_points = ($customer->reward_points ?? 0) + $pointsEarned - $validated['reward_points_used'];
                
                $customer->save();
            }
        }

        ActivityLogService::log('pos_sale', "POS Sale: {$validated['order_number']} - $".number_format($validated['total_amount'], 2), ['order_number' => $validated['order_number'], 'total' => $validated['total_amount']]);

        return redirect()->route('pos.index')->with('success', 'Sale completed successfully.')->with('new_order_id', $order->id);
    }

    public function hold(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        // Do not deduct stock for held orders to avoid messing up inventory, 
        // stock deduction happens when the order is completed.
        // We will just save it with 'Held' status.
        $validated['order_number'] = 'HELD-' . strtoupper(uniqid());
        $validated['status'] = 'Held';
        $validated['user_id'] = auth()->id();
        $validated['branch_id'] = auth()->user()->branch_id;

        Order::create($validated);
        
        return back()->with('success', 'Sale held successfully.');
    }

    public function heldOrders()
    {
        // Fetch only held orders, maybe limited to the current user or all.
        // Let's allow fetching all held orders.
        $heldOrders = Order::with('customer')->where('status', 'Held')->orderBy('created_at', 'desc')->get();
        return response()->json($heldOrders);
    }

    public function resume($id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status !== 'Held') {
            return back()->with('error', 'Only held orders can be resumed.');
        }

        // To resume, we just return the data to the frontend or 
        // in Inertia we could just delete the held order and return its data
        // But since this is a POST request, we can delete the held order 
        // and return the items to be loaded in the POS state.
        
        $data = $order->toArray();
        $order->delete();
        
        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
