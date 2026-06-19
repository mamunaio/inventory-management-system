<?php

namespace App\Services;

use App\Models\Activity;

class ActivityLogService
{
    public static function log($action, $description = '', $properties = [])
    {
        Activity::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
