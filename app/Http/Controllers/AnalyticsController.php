<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Expense;
use App\Models\Product;
use App\Services\ForecastingService;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        // Gross Profit vs Net Profit (Last 6 Months)
        $monthlyFinancials = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            
            // Total Revenue
            $revenue = Order::where('status', 'Completed')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_amount');
            
            // COGS (Cost of Goods Sold)
            $cogs = 0;
            $orders = Order::where('status', 'Completed')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->get();
                
            foreach ($orders as $order) {
                if (isset($order->items) && is_array($order->items)) {
                    foreach ($order->items as $item) {
                        $cogs += ($item['cost_price'] ?? 0) * $item['quantity'];
                    }
                }
            }

            $grossProfit = $revenue - $cogs;
            
            $expenses = Expense::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');
                
            $netProfit = $grossProfit - $expenses;

            $monthlyFinancials[] = [
                'month' => $month->format('M Y'),
                'revenue' => round($revenue, 2),
                'cogs' => round($cogs, 2),
                'gross_profit' => round($grossProfit, 2),
                'expenses' => round($expenses, 2),
                'net_profit' => round($netProfit, 2),
            ];
        }

        // Profitability by Category (All time)
        // Note: In MongoDB, aggregation is best, but since items are nested in Orders and products might have changed categories,
        // we will approximate by fetching all products and their sales.
        $categoryProfits = [];
        $orders = Order::where('status', 'Completed')->get();
        
        foreach ($orders as $order) {
            if (isset($order->items) && is_array($order->items)) {
                foreach ($order->items as $item) {
                    $product = Product::find($item['product_id']);
                    $category = $product ? ($product->category ?? 'Uncategorized') : 'Unknown';
                    
                    if (!isset($categoryProfits[$category])) {
                        $categoryProfits[$category] = ['revenue' => 0, 'cogs' => 0];
                    }
                    
                    $rev = ($item['price'] ?? 0) * $item['quantity'];
                    $cost = ($item['cost_price'] ?? 0) * $item['quantity'];
                    
                    $categoryProfits[$category]['revenue'] += $rev;
                    $categoryProfits[$category]['cogs'] += $cost;
                }
            }
        }

        $formattedCategoryProfits = [];
        foreach ($categoryProfits as $cat => $data) {
            $profit = $data['revenue'] - $data['cogs'];
            if ($profit > 0) {
                $formattedCategoryProfits[] = [
                    'name' => $cat,
                    'value' => round($profit, 2)
                ];
            }
        }
        
        // Sort pie chart data
        usort($formattedCategoryProfits, fn($a, $b) => $b['value'] <=> $a['value']);
        $formattedCategoryProfits = array_slice($formattedCategoryProfits, 0, 5); // Top 5 categories

        // AI Forecasting
        $forecasts = ForecastingService::predictNextMonthDemand(6);

        return Inertia::render('Analytics/Index', [
            'monthlyFinancials' => $monthlyFinancials,
            'categoryProfits' => $formattedCategoryProfits,
            'forecasts' => $forecasts
        ]);
    }
}
