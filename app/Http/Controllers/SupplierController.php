<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('name', 'asc')->get();
        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string'
        ]);

        Supplier::create($validated);

        return redirect()->route('suppliers.index')->with('success', 'Supplier created successfully.');
    }
}
