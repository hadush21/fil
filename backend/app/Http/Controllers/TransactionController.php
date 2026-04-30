<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Report;

class TransactionController extends Controller
{
    // GET TRANSACTIONS
    public function index($id)
    {
        return Transaction::where('report_id', $id)->get();
    }

    // ADD TRANSACTION
    public function store(Request $request, $id)
    {
        $request->validate([
            'type' => 'required',
            'date' => 'required',
            'description' => 'required',
            'amount' => 'required'
        ]);

        $transaction = Transaction::create([
            'report_id' => $id,
            'type' => $request->type,
            'date' => $request->date,
            'description' => $request->description,
            'amount' => $request->amount
        ]);

        return response()->json($transaction);
    }

    // DELETE TRANSACTION
    public function destroy($id)
    {
        Transaction::destroy($id);

        return response()->json([
            'message' => 'Transaction deleted'
        ]);
    }
}