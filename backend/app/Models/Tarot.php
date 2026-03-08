<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarot extends Model
{
    protected $fillable = [
        'number',
        'name',
        'image',
        'short_description',
        'long_description',
        'keywords',
        'category',
    ];

    public function readings()
    {
        return $this->hasMany(TarotReading::class, 'main_tarot_id');
    }
}
