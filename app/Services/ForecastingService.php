<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;

class ForecastingService
{
    /**
     * Forecast the demand for the next month based on simple linear regression 
     * of the last $months of sales data.
     */
    public static function predictNextMonthDemand(int $months = 6): array
    {
        $forecasts = [];
        $products = Product::all();

        $startDate = Carbon::now()->subMonths($months)->startOfMonth();

        // Get all completed orders since $startDate
        $orders = Order::where('status', 'Completed')
            ->where('created_at', '>=', $startDate)
            ->get();

        foreach ($products as $product) {
            $monthlySales = array_fill(0, $months, 0);

            // Calculate sales per month for this product
            foreach ($orders as $order) {
                if (!isset($order->items) || !is_array($order->items)) continue;
                
                foreach ($order->items as $item) {
                    if ($item['product_id'] === $product->id) {
                        $orderMonthDiff = Carbon::parse($order->created_at)->diffInMonths(Carbon::now());
                        // e.g., if it was this month, diff is 0. Last month is 1.
                        $index = $months - 1 - $orderMonthDiff;
                        
                        if ($index >= 0 && $index < $months) {
                            $monthlySales[$index] += $item['quantity'];
                        }
                    }
                }
            }

            // Simple Linear Regression: y = mx + b
            // x = time index (1 to $months)
            // y = sales quantity
            
            $sumX = 0;
            $sumY = 0;
            $sumXY = 0;
            $sumXX = 0;
            $n = $months;

            for ($i = 0; $i < $n; $i++) {
                $x = $i + 1;
                $y = $monthlySales[$i];
                
                $sumX += $x;
                $sumY += $y;
                $sumXY += ($x * $y);
                $sumXX += ($x * $x);
            }

            $denominator = (($n * $sumXX) - ($sumX * $sumX));
            
            if ($denominator != 0) {
                $m = (($n * $sumXY) - ($sumX * $sumY)) / $denominator;
                $b = ($sumY - ($m * $sumX)) / $n;
            } else {
                $m = 0;
                $b = $sumY / $n;
            }

            // Predict next month (x = $n + 1)
            $nextX = $n + 1;
            $predictedDemand = ($m * $nextX) + $b;
            
            // Cannot have negative demand
            $predictedDemand = max(0, round($predictedDemand));

            $forecasts[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'current_stock' => ($product->stock ?? 0) + ($product->warehouse_stock ?? 0) + collect($product->branch_stocks ?? [])->sum('stock'),
                'predicted_demand' => $predictedDemand,
                'trend' => $m > 0 ? 'Upward' : ($m < 0 ? 'Downward' : 'Stable'),
                'historical_avg' => round($sumY / $n, 2)
            ];
        }

        // Sort by highest predicted demand
        usort($forecasts, fn($a, $b) => $b['predicted_demand'] <=> $a['predicted_demand']);

        return array_slice($forecasts, 0, 10); // Return top 10
    }
}
