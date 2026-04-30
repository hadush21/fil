<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    // GET ALL REPORTS
    public function index()
    {
        return Report::all();
    }

    // CREATE REPORT
    public function store(Request $request)
    {
        $request->validate([
            'month' => 'required',
            'year' => 'required',
            'title' => 'required',
            'opening_balance' => 'required'
        ]);

        $report = Report::create($request->all());

        return response()->json($report);
    }

    // SHOW SINGLE REPORT (WITH CALCULATIONS)
    public function show($id)
    {
        $report = Report::with('transactions')->findOrFail($id);

        $income = $report->transactions->where('type', 'income')->sum('amount');
        $expense = $report->transactions->where('type', 'expense')->sum('amount');

        return response()->json([
            'report' => $report,
            'total_income' => $income,
            'total_expenses' => $expense,
            'closing_balance' => $report->opening_balance + $income - $expense
        ]);
    }

    // DELETE REPORT
    public function destroy($id)
    {
        Report::destroy($id);

        return response()->json([
            'message' => 'Report deleted'
        ]);
    }
}