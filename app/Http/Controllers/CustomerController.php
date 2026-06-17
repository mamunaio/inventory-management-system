<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'desc')->get();
        return Inertia::render('Customers/Index', [
            'customers' => $customers
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

        return redirect()->back()->with('success', 'Customer created successfully.');
    }
}
