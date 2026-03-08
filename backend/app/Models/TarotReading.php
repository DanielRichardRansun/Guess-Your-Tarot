<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TarotReading extends Model
{
    protected $fillable = [
        'user_id',
        'guest_ip',
        'input_text',
        'source',
        'source_data',
        'main_tarot_id',
        'main_tarot_name',
        'short_explanation',
        'long_explanation',
        'support_tarots',
        'challenge_tarots',
        'share_slug',
    ];

    protected $casts = [
        'source_data' => 'array',
        'support_tarots' => 'array',
        'challenge_tarots' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reading) {
            if (empty($reading->share_slug)) {
                $reading->share_slug = Str::random(12);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mainTarot()
    {
        return $this->belongsTo(Tarot::class, 'main_tarot_id');
    }

    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function isFavoritedBy($userId)
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }
}
