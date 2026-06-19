<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('name', 'asc')->get();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        Supplier::create($validated);
        ActivityLogService::log('supplier_created', "Added supplier: {$validated['name']}", ['supplier_name' => $validated['name']]);

        return redirect()->back()->with('success', 'Supplier created successfully.');
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:suppliers,email,'.$id.',_id',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $supplier->update($validated);
        ActivityLogService::log('supplier_updated', "Updated supplier: {$supplier->name}", ['supplier_name' => $supplier->name]);

        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
        ActivityLogService::log('supplier_deleted', "Deleted supplier: {$supplier->name}", ['supplier_name' => $supplier->name]);

        return redirect()->back()->with('success', 'Supplier deleted successfully.');
    }
}
