<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $collection = 'products';
    protected $guarded = [];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', '_id');
    }
}
