<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Attendance extends Model
{
    protected $collection = 'attendances';
    protected $guarded = [];
}
