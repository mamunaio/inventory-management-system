<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Expense;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Attendance;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $today = Carbon::today();
        
        // HR Data
        $attendance = Attendance::where('user_id', $userId)->where('date', $today->toDateString())->first();
        $isClockedIn = $attendance && $attendance->clock_in && !$attendance->clock_out;
        
        $myCommissions = Order::where('user_id', $userId)
            ->where('status', 'Completed')
            ->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->sum('commission_amount');

        $totalRevenue = Order::where('status', 'Completed')->sum('total_amount');
        $totalCustomers = Customer::count();
        $totalOrders = Order::count();
        $totalExpenses = Expense::sum('amount');
        $netProfit = $totalRevenue - $totalExpenses;

        $lowStockProducts = Product::where('stock', '<', 10)->get();
        $recentOrders = Order::with('customer')->orderBy('created_at', 'desc')->take(5)->get();

        // Weekly chart (last 7 days)
        $chartData = [];
        $chartLabels = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $chartLabels[] = $date->format('D');
            $dailySales = Order::where('status', 'Completed')
                ->where('created_at', '>=', $date->copy()->startOfDay())
                ->where('created_at', '<=', $date->copy()->endOfDay())
                ->sum('total_amount');
            $chartData[] = round($dailySales, 2);
        }

        // Monthly comparison (last 6 months)
        $monthlyRevenue = [];
        $monthlyExpenses = [];
        $monthlyLabels = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthlyLabels[] = $month->format('M Y');
            $rev = Order::where('status', 'Completed')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_amount');
            $exp = Expense::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');
            $monthlyRevenue[] = round($rev, 2);
            $monthlyExpenses[] = round($exp, 2);
        }

        // Top selling products
        $topProductIds = Order::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => 'Completed']],
                ['$unwind' => '$items'],
                ['$group' => [
                    '_id' => '$items.product_id',
                    'total_quantity' => ['$sum' => '$items.quantity']
                ]],
                ['$sort' => ['total_quantity' => -1]],
                ['$limit' => 5],
            ]);
        });

        $topProducts = collect($topProductIds)->map(function ($record) {
            $product = Product::find($record->_id);
            return [
                'name' => $product ? $product->name : 'Unknown Product',
                'quantity' => $record->total_quantity ?? 0,
                'price' => $product ? $product->price : 0,
            ];
        });

        // Expense by category
        $expenseByCategory = Expense::raw(function ($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$category', 'total' => ['$sum' => '$amount'], 'count' => ['$sum' => 1]]],
                ['$sort' => ['total' => -1]],
            ]);
        });
        $expenseCategories = $expenseByCategory->map(fn ($e) => [
            'category' => $e->_id ?? 'Uncategorized',
            'total' => round($e->total, 2),
            'count' => $e->count,
        ])->toArray();

        // Order status breakdown
        $orderStatuses = Order::raw(function ($collection) {
            return $collection->aggregate([
                ['$group' => ['_id' => '$status', 'count' => ['$sum' => 1], 'total' => ['$sum' => '$total_amount']]],
            ]);
        });
        $statusBreakdown = $orderStatuses->map(fn ($s) => [
            'status' => $s->_id ?? 'Unknown',
            'count' => $s->count,
            'total' => round($s->total, 2),
        ])->toArray();

        // Today's stats
        $todayOrders = Order::where('created_at', '>=', Carbon::now()->startOfDay())->count();
        $todayRevenue = Order::where('status', 'Completed')
            ->where('created_at', '>=', Carbon::now()->startOfDay())
            ->sum('total_amount');
        $todayExpenses = Expense::where('created_at', '>=', Carbon::now()->startOfDay())->sum('amount');

        // Find expiring batches (within next 30 days)
        $thirtyDaysFromNow = Carbon::now()->addDays(30);
        $expiringBatches = [];
        $productsWithBatches = Product::whereNotNull('batches')->where('batches', '!=', [])->get();
        foreach ($productsWithBatches as $product) {
            if (is_array($product->batches)) {
                foreach ($product->batches as $batch) {
                    if (isset($batch['expiry_date'])) {
                        $expiryDate = Carbon::parse($batch['expiry_date']);
                        if ($expiryDate->isPast() || $expiryDate->lessThanOrEqualTo($thirtyDaysFromNow)) {
                            $expiringBatches[] = [
                                'product_name' => $product->name,
                                'batch_number' => $batch['batch_number'],
                                'expiry_date' => $batch['expiry_date'],
                                'quantity' => $batch['quantity'],
                                'days_left' => Carbon::now()->diffInDays($expiryDate, false)
                            ];
                        }
                    }
                }
            }
        }
        usort($expiringBatches, fn($a, $b) => $a['days_left'] <=> $b['days_left']);

        return Inertia::render('Dashboard', [
            'metrics' => [
                'totalRevenue' => $totalRevenue,
                'totalCustomers' => $totalCustomers,
                'totalOrders' => $totalOrders,
                'totalExpenses' => $totalExpenses,
                'netProfit' => $netProfit,
                'todayOrders' => $todayOrders,
                'todayRevenue' => round($todayRevenue, 2),
                'todayExpenses' => round($todayExpenses, 2),
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'chartData' => $chartData,
            'chartLabels' => $chartLabels,
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyExpenses' => $monthlyExpenses,
            'monthlyLabels' => $monthlyLabels,
            'topProducts' => $topProducts,
            'expenseCategories' => $expenseCategories,
            'statusBreakdown' => $statusBreakdown,
            'expiringBatches' => $expiringBatches,
            'hr' => [
                'isClockedIn' => (bool)$isClockedIn,
                'myCommissions' => round($myCommissions, 2),
            ]
        ]);
    }
}
