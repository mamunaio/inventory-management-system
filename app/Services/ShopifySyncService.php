<?php

namespace App\Services;

use App\Models\Integration;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ShopifySyncService
{
    /**
     * Simulate pushing an inventory update to Shopify.
     */
    public static function syncInventory(Product $product)
    {
        $shopifyIntegration = Integration::where('platform', 'Shopify')->where('auto_sync', true)->first();

        if (!$shopifyIntegration) {
            return;
        }

        // Total stock available across warehouse and branches
        $totalStock = ($product->stock ?? 0) + ($product->warehouse_stock ?? 0) + collect($product->branch_stocks ?? [])->sum('stock');

        // Simulate API call to Shopify
        $url = $shopifyIntegration->store_url . '/admin/api/2024-01/inventory_levels/set.json';
        
        $payload = [
            'location_id' => 'SIMULATED_LOCATION',
            'inventory_item_id' => $product->sku, // using SKU as proxy
            'available' => $totalStock
        ];

        // In a real environment, we'd use HTTP client
        // Http::withHeaders(['X-Shopify-Access-Token' => $shopifyIntegration->api_key])->post($url, $payload);

        // For simulation, we just log it
        Log::info("SIMULATED SHOPIFY SYNC", [
            'store' => $shopifyIntegration->store_url,
            'product' => $product->name,
            'new_stock' => $totalStock,
            'payload' => $payload
        ]);

        ActivityLogService::log('ecommerce_sync', "Simulated Shopify inventory sync for {$product->name} (Stock: {$totalStock})");
    }
}
