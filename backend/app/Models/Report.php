<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'month',
        'year',
        'title',
        'opening_balance'
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}