<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        $branches = \App\Models\Branch::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,cashier',
            'branch_id' => 'nullable|string',
            'base_salary' => 'nullable|numeric|min:0',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);
        \App\Services\ActivityLogService::log('user_created', "Created user: {$validated['name']} ({$validated['role']})", ['user_name' => $validated['name'], 'role' => $validated['role']]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$id.',_id',
            'role' => 'required|in:admin,cashier',
            'password' => 'nullable|string|min:6|confirmed',
            'branch_id' => 'nullable|string',
            'base_salary' => 'nullable|numeric|min:0',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        \App\Services\ActivityLogService::log('user_updated', "Updated user: {$user->name}", ['user_name' => $user->name]);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();
        ActivityLogService::log('user_deleted', "Deleted user: {$user->name}", ['user_name' => $user->name]);

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
