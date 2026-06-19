<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Expense extends Model
{
    protected $collection = 'expenses';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
