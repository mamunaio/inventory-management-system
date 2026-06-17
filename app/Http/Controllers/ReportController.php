<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->endOfMonth()->toDateString());

        $orders = Order::whereBetween('created_at', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay()
        ])->where('status', 'Completed')->get();

        $totalRevenue = 0;
        $totalCogs = 0;

        foreach ($orders as $order) {
            $totalRevenue += $order->total_amount;
            foreach ($order->items as $item) {
                // Check if cost_price exists (for older records without it)
                $cost = isset($item['cost_price']) ? $item['cost_price'] : 0;
                $totalCogs += ($cost * $item['quantity']);
            }
        }

        $netProfit = $totalRevenue - $totalCogs;

        return Inertia::render('Reports/Index', [
            'metrics' => [
                'totalRevenue' => $totalRevenue,
                'totalCogs' => $totalCogs,
                'netProfit' => $netProfit,
                'totalOrders' => $orders->count()
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }

    public function exportSales(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->endOfMonth()->toDateString());

        $orders = Order::with('customer')->whereBetween('created_at', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay()
        ])->get();

        $response = new StreamedResponse(function() use ($orders) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Order ID', 'Date', 'Customer Name', 'Status', 'Total Amount']);
            foreach ($orders as $order) {
                fputcsv($handle, [
                    $order->order_number,
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->customer->name ?? 'Unknown',
                    $order->status,
                    $order->total_amount
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="sales_report_'.$startDate.'_to_'.$endDate.'.csv"');

        return $response;
    }

    public function exportInventory()
    {
        $products = Product::all();

        $response = new StreamedResponse(function() use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Product Name', 'SKU', 'Category', 'Barcode', 'Cost Price', 'Selling Price', 'Stock Level', 'Total Value (Cost)']);
            foreach ($products as $product) {
                fputcsv($handle, [
                    $product->name,
                    $product->sku,
                    $product->category ?? '-',
                    $product->barcode ?? '-',
                    $product->cost_price ?? 0,
                    $product->price,
                    $product->stock,
                    ($product->cost_price ?? 0) * $product->stock
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="inventory_report_'.Carbon::now()->format('Y-m-d').'.csv"');

        return $response;
    }
}
