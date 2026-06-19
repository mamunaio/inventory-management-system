<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('user')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();
        Expense::create($validated);
        ActivityLogService::log('expense_created', "Recorded expense: {$validated['title']} - $".number_format($validated['amount'], 2), ['expense_title' => $validated['title'], 'amount' => $validated['amount']]);

        return redirect()->back()->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $expense->update($validated);
        ActivityLogService::log('expense_updated', "Updated expense: {$expense->title}", ['expense_title' => $expense->title]);

        return redirect()->back()->with('success', 'Expense updated successfully.');
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        ActivityLogService::log('expense_deleted', "Deleted expense: {$expense->title}", ['expense_title' => $expense->title]);

        return redirect()->back()->with('success', 'Expense deleted successfully.');
    }
}
