<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'desc')->get();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();
        Customer::create($validated);
        ActivityLogService::log('customer_created', "Added customer: {$validated['name']}", ['customer_name' => $validated['name']]);

        return redirect()->back()->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:customers,email,'.$id.',_id',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
        ]);

        $customer->update($validated);
        ActivityLogService::log('customer_updated', "Updated customer: {$customer->name}", ['customer_name' => $customer->name]);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        ActivityLogService::log('customer_deleted', "Deleted customer: {$customer->name}", ['customer_name' => $customer->name]);

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }

    public function payDue(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        if (($customer->total_due ?? 0) < $validated['amount']) {
            return back()->withErrors(['amount' => 'Payment amount cannot exceed total due.']);
        }

        $customer->total_due -= $validated['amount'];
        $customer->save();

        ActivityLogService::log('due_collected', "Collected due from {$customer->name}: $".number_format($validated['amount'], 2), ['customer_name' => $customer->name, 'amount' => $validated['amount']]);

        return redirect()->back()->with('success', 'Due collected successfully.');
    }
}
