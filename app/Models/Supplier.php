<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Supplier extends Model
{
    protected $collection = 'suppliers';
    protected $guarded = [];
}
