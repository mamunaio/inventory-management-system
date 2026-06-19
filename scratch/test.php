<?php
use App\Models\Order;

try {
    $cursor = Order::raw(function($c) {
        return $c->pipeline([
            ['$match' => ['status' => 'Completed']]
        ]);
    });
    echo "Is Cursor: " . ($cursor instanceof MongoDB\Driver\Cursor ? 'Yes' : 'No') . "\n";
    $collection = collect($cursor);
    echo "Count: " . $collection->count() . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
