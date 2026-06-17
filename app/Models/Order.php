<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $collection = 'orders';
    protected $guarded = [];

    // Assuming we want a relationship to Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', '_id');
    }
}
