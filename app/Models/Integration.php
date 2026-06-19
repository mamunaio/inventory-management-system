<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Integration extends Model
{
    protected $collection = 'integrations';
    protected $guarded = [];
}
