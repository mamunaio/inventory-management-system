<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // IG-Inventory Pro Routes
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');

    Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store'])->name('customers.store');

    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [\App\Http\Controllers\OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{id}/invoice', [\App\Http\Controllers\OrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::post('/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus'])->name('orders.status');

    Route::get('/suppliers', [\App\Http\Controllers\SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('/suppliers', [\App\Http\Controllers\SupplierController::class, 'store'])->name('suppliers.store');

    Route::get('/purchases', [\App\Http\Controllers\PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchases/create', [\App\Http\Controllers\PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchases', [\App\Http\Controllers\PurchaseController::class, 'store'])->name('purchases.store');

    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-sales', [\App\Http\Controllers\ReportController::class, 'exportSales'])->name('reports.export-sales');
    Route::get('/reports/export-inventory', [\App\Http\Controllers\ReportController::class, 'exportInventory'])->name('reports.export-inventory');
});

require __DIR__.'/auth.php';
