<?php

namespace App\Http\Controllers;

use App\Models\Tarot;
use App\Models\TarotReading;
use App\Models\UserFavorite;
use App\Services\TarotAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TarotReadingController extends Controller
{
    public function create(Request $request, TarotAIService $aiService)
    {
        $request->validate([
            'input_text' => 'required_without:source_data|string|max:2000',
            'source' => 'sometimes|string|in:text,spotify,steam,github,strava,youtube,discord',
            'source_data' => 'sometimes|array',
        ]);

        // Guest rate limiting
        if (!Auth::check()) {
            $ip = $request->ip();
            $todayCount = TarotReading::where('guest_ip', $ip)
                ->whereNull('user_id')
                ->whereDate('created_at', today())
                ->count();

            if ($todayCount >= 2) {
                return response()->json([
                    'message' => 'You\'ve reached your daily limit! Login or create an account to get unlimited tarot readings.',
                    'limit_reached' => true,
                ], 429);
            }
        }

        $source = $request->input('source', 'text');
        $inputText = $request->input('input_text', '');
        $sourceData = $request->input('source_data');

        // If source is social media, create a summary for the AI
        if ($source !== 'text' && $sourceData) {
            $inputText = $inputText ?: "Based on my {$source} activity";
        }

        try {
            $aiResult = $aiService->generateReading($inputText, $source, $sourceData);

            $reading = TarotReading::create([
                'user_id' => Auth::id(),
                'guest_ip' => Auth::check() ? null : $request->ip(),
                'input_text' => $request->input('input_text', $inputText),
                'source' => $source,
                'source_data' => $sourceData,
                'main_tarot_id' => $aiResult['main_tarot_id'],
                'main_tarot_name' => $aiResult['main_tarot_name'],
                'short_explanation' => $aiResult['short_explanation'],
                'long_explanation' => $aiResult['long_explanation'],
                'support_tarots' => $aiResult['support_tarots'],
                'challenge_tarots' => $aiResult['challenge_tarots'],
                'share_slug' => Str::random(12),
            ]);

            // Update user's current tarot if logged in
            if (Auth::check()) {
                Auth::user()->update(['current_tarot_id' => $aiResult['main_tarot_id']]);
            }

            $reading->load('mainTarot');

            return response()->json([
                'reading' => $reading,
                'redirect' => "/reading/{$reading->share_slug}",
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate your tarot reading. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function show(string $slug)
    {
        $reading = TarotReading::where('share_slug', $slug)
            ->with('mainTarot')
            ->firstOrFail();

        $isFavorited = false;
        if (Auth::check()) {
            $isFavorited = UserFavorite::where('user_id', Auth::id())
                ->where('tarot_reading_id', $reading->id)
                ->exists();
        }

        return response()->json([
            'reading' => $reading,
            'is_favorited' => $isFavorited,
        ]);
    }

    public function history(Request $request)
    {
        $readings = TarotReading::where('user_id', Auth::id())
            ->with('mainTarot')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($readings);
    }

    public function favorites(Request $request)
    {
        $favoriteIds = UserFavorite::where('user_id', Auth::id())
            ->pluck('tarot_reading_id');

        $readings = TarotReading::whereIn('id', $favoriteIds)
            ->with('mainTarot')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($readings);
    }

    public function toggleFavorite(Request $request, int $id)
    {
        $reading = TarotReading::findOrFail($id);

        $existing = UserFavorite::where('user_id', Auth::id())
            ->where('tarot_reading_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['is_favorited' => false, 'message' => 'Removed from favorites']);
        }

        UserFavorite::create([
            'user_id' => Auth::id(),
            'tarot_reading_id' => $id,
        ]);

        return response()->json(['is_favorited' => true, 'message' => 'Added to favorites']);
    }
}
