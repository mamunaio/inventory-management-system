<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Order;
use Carbon\Carbon;
use App\Services\ActivityLogService;

class HRController extends Controller
{
    // Clock In/Out from Dashboard
    public function clockIn()
    {
        $userId = auth()->id();
        $today = Carbon::today();

        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today->toDateString())
            ->first();

        if ($attendance && $attendance->clock_in) {
            return back()->with('error', 'Already clocked in today.');
        }

        if (!$attendance) {
            Attendance::create([
                'user_id' => $userId,
                'date' => $today->toDateString(),
                'clock_in' => Carbon::now()->toDateTimeString(),
                'status' => 'Present',
            ]);
        } else {
            $attendance->update([
                'clock_in' => Carbon::now()->toDateTimeString(),
            ]);
        }

        ActivityLogService::log('clock_in', "User clocked in.", ['user_id' => $userId]);

        return back()->with('success', 'Clocked in successfully.');
    }

    public function clockOut()
    {
        $userId = auth()->id();
        $today = Carbon::today();

        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today->toDateString())
            ->first();

        if (!$attendance || !$attendance->clock_in) {
            return back()->with('error', 'You must clock in first.');
        }

        if ($attendance->clock_out) {
            return back()->with('error', 'Already clocked out today.');
        }

        $clockInTime = Carbon::parse($attendance->clock_in);
        $clockOutTime = Carbon::now();
        $hoursWorked = $clockInTime->diffInMinutes($clockOutTime) / 60;

        $attendance->update([
            'clock_out' => $clockOutTime->toDateTimeString(),
            'hours_worked' => round($hoursWorked, 2),
        ]);

        ActivityLogService::log('clock_out', "User clocked out.", ['user_id' => $userId, 'hours' => round($hoursWorked, 2)]);

        return back()->with('success', 'Clocked out successfully.');
    }

    // HR Payroll view
    public function payroll()
    {
        $users = User::all();
        $payrollData = [];

        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        foreach ($users as $user) {
            // Calculate base salary
            $baseSalary = $user->base_salary ?? 0;

            // Calculate commissions
            $commissions = Order::where('user_id', $user->id)
                ->where('status', 'Completed')
                ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
                ->sum('commission_amount');

            // Calculate attendance days
            $daysPresent = Attendance::where('user_id', $user->id)
                ->whereBetween('date', [$currentMonthStart->toDateString(), $currentMonthEnd->toDateString()])
                ->where('status', 'Present')
                ->count();

            $totalHours = Attendance::where('user_id', $user->id)
                ->whereBetween('date', [$currentMonthStart->toDateString(), $currentMonthEnd->toDateString()])
                ->sum('hours_worked');

            $payrollData[] = [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'base_salary' => $baseSalary,
                'commissions' => $commissions,
                'total_pay' => $baseSalary + $commissions,
                'days_present' => $daysPresent,
                'total_hours' => round($totalHours, 2),
            ];
        }

        return Inertia::render('HR/Payroll', [
            'payroll' => $payrollData,
            'month' => Carbon::now()->format('F Y'),
        ]);
    }
}
