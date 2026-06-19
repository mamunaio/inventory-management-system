<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Branch extends Model
{
    protected $collection = 'branches';
    protected $guarded = [];
}
