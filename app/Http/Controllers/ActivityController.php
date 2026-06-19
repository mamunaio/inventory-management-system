<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::with('user')->orderBy('created_at', 'desc')->take(100)->get();

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
        ]);
    }
}
