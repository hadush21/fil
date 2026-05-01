<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // ✅ CREATE REPORT
    public function store(Request $request)
    {
        // 1. Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'opening_balance' => 'required|numeric',
        ]);

        // 2. Create report
        $report = Report::create([
            'title' => $validated['title'],
            'month' => $validated['month'],
            'year' => $validated['year'],
            'opening_balance' => $validated['opening_balance'],
        ]);

        // 3. Load relationships (IMPORTANT for frontend)
        $report->load('transactions');

        // 4. Return full report with computed attributes
        return response()->json($report, 201);
    }

    // ✅ GET ALL REPORTS
    public function index()
    {
        return Report::with('transactions')->get();
    }

    // ✅ GET SINGLE REPORT
    public function show($id)
    {
        return Report::with('transactions')->findOrFail($id);
    }

    // ✅ DELETE REPORT
    public function destroy($id)
    {
        Report::destroy($id);

        return response()->json([
            'message' => 'Report deleted successfully'
        ]);
    }
}