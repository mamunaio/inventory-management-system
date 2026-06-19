<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Shared Routes (Admin & Cashier)
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{id}/barcode', [ProductController::class, 'printBarcode'])->name('products.barcode');

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::post('/customers/{id}/pay-due', [CustomerController::class, 'payDue'])->name('customers.payDue');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{id}/invoice', [OrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::get('/orders/{id}/receipt', [OrderController::class, 'receipt'])->name('orders.receipt');
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    // POS Terminal Routes
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos', [PosController::class, 'store'])->name('pos.store');
    Route::post('/pos/hold', [PosController::class, 'hold'])->name('pos.hold');
    Route::get('/pos/held', [PosController::class, 'heldOrders'])->name('pos.held');
    Route::post('/pos/resume/{id}', [PosController::class, 'resume'])->name('pos.resume');

    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        Route::resource('branches', \App\Http\Controllers\BranchController::class);

        // HR Routes
        Route::post('/hr/clock-in', [\App\Http\Controllers\HRController::class, 'clockIn'])->name('hr.clock-in');
        Route::post('/hr/clock-out', [\App\Http\Controllers\HRController::class, 'clockOut'])->name('hr.clock-out');
        Route::get('/hr/payroll', [\App\Http\Controllers\HRController::class, 'payroll'])->name('hr.payroll');

        // Analytics Route
        Route::get('/analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])->name('analytics.index');

        // Integrations Route
        Route::get('/integrations', [\App\Http\Controllers\IntegrationController::class, 'index'])->name('integrations.index');
        Route::post('/integrations', [\App\Http\Controllers\IntegrationController::class, 'storeOrUpdate'])->name('integrations.storeOrUpdate');
        Route::delete('/integrations/{id}', [\App\Http\Controllers\IntegrationController::class, 'destroy'])->name('integrations.destroy');

        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/products/{id}/barcode', [ProductController::class, 'printBarcode'])->name('products.barcode');
        Route::post('/products/{id}/transfer-stock', [ProductController::class, 'transferStock'])->name('products.transferStock');
        Route::post('/products/{id}/batches', [ProductController::class, 'updateBatches'])->name('products.batches');
        
        Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');

        Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');

        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export-sales', [ReportController::class, 'exportSales'])->name('reports.export-sales');
        Route::get('/reports/export-inventory', [ReportController::class, 'exportInventory'])->name('reports.export-inventory');
        Route::get('/reports/export-activity-log', [ReportController::class, 'exportActivityLog'])->name('reports.export-activity-log');
        Route::get('/reports/export-expenses', [ReportController::class, 'exportExpenses'])->name('reports.export-expenses');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::put('/expenses/{id}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

        Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
    });
});

require __DIR__.'/auth.php';
