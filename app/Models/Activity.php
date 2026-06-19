<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Activity extends Model
{
    protected $collection = 'activities';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
