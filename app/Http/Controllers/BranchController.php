<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Branch;
use App\Services\ActivityLogService;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index()
    {
        return Inertia::render('Branches/Index', [
            'branches' => Branch::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $branch = Branch::create($validated);
        ActivityLogService::log('branch_created', "Created branch: {$branch->name}");

        return back()->with('success', 'Branch created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive',
        ]);

        $branch = Branch::findOrFail($id);
        $branch->update($validated);
        ActivityLogService::log('branch_updated', "Updated branch: {$branch->name}");

        return back()->with('success', 'Branch updated successfully.');
    }

    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $name = $branch->name;
        $branch->delete();
        ActivityLogService::log('branch_deleted', "Deleted branch: {$name}");

        return back()->with('success', 'Branch deleted successfully.');
    }
}
