<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Customer extends Model
{
    protected $collection = 'customers';
    protected $guarded = [];
}
