<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Purchase extends Model
{
    protected $collection = 'purchases';
    protected $guarded = [];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', '_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', '_id');
    }
}
