<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        return Inertia::render('Products/Index', [
            'products' => $products
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
        ]);

        if (empty($validated['barcode'])) {
            $validated['barcode'] = mt_rand(100000000000, 999999999999); // Auto generate 12 digit EAN
        }

        $validated['user_id'] = auth()->id();
        Product::create($validated);

        return redirect()->back()->with('success', 'Product created successfully.');
    }
}
