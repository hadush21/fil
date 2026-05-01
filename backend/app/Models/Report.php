<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'title',
        'month',
        'year',
        'opening_balance',
    ];

    // 🔥 ALWAYS include computed fields in JSON response
    protected $appends = [
        'total_income',
        'total_expenses',
        'closing_balance'
    ];

    // relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // TOTAL INCOME
    public function getTotalIncomeAttribute()
    {
        return $this->transactions()
            ->where('type', 'income')
            ->sum('amount');
    }

    // TOTAL EXPENSES
    public function getTotalExpensesAttribute()
    {
        return $this->transactions()
            ->where('type', 'expense')
            ->sum('amount');
    }

    // CLOSING BALANCE
    public function getClosingBalanceAttribute()
    {
        return $this->opening_balance
            + $this->total_income
            - $this->total_expenses;
    }
}