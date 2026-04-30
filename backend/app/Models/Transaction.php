<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'report_id',
        'type',
        'date',
        'description',
        'amount'
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}