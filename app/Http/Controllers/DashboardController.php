<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', 'Completed')->sum('total_amount');
        $totalCustomers = Customer::count();
        $totalOrders = Order::count();
        
        $lowStockProducts = Product::where('stock', '<', 10)->get();
        $recentOrders = Order::with('customer')->orderBy('created_at', 'desc')->take(5)->get();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'totalRevenue' => $totalRevenue,
                'totalCustomers' => $totalCustomers,
                'totalOrders' => $totalOrders,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
        ]);
    }
}
