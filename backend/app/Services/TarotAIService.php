<?php

namespace App\Services;

use App\Models\Tarot;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TarotAIService
{
    private string $apiKey;
    private array $modelNames = ['gemini-3-flash-preview', 'gemini-2.5-flash'];

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    public function generateReading(string $userInput, string $source = 'text', ?array $sourceData = null, string $language = 'EN'): array
    {
        $tarots = Tarot::all();
        $tarotList = $tarots->map(fn($t) => "#{$t->number} {$t->name}")->implode(', ');

        $contextInfo = '';
        if ($source !== 'text' && $sourceData) {
            $contextInfo = "\n\nThe user connected their {$source} account. Here is their recent activity data:\n" . json_encode($sourceData, JSON_PRETTY_PRINT);
        }

        $langName = ($language === 'ID') ? 'Indonesian' : 'English';
        $systemInstruction = <<<PROMPT
You are a mystical and wise tarot reader AI. Based on the user's message, choose the most fitting tarot card for them today and provide a detailed reading.
{$contextInfo}

Available tarot cards (use these exact numbers): {$tarotList}

You MUST respond in the following JSON format (no markdown, no code blocks, just pure JSON):
{
    "main_tarot_number": <number of the chosen tarot card>,
    "short_explanation": "<A compelling 2-3 sentence summary of why this card was chosen for the user. Make it personal and relate to what they said.>",
    "long_explanation": "<A detailed reading in 3-4 paragraphs. First paragraph: introduce the card and why it resonates with the user. Second paragraph: break down what this means for different areas of their life (love, career, personal growth) as bullet points use • symbol. Third paragraph: advice and guidance for moving forward. Make it mystical yet practical, encouraging yet honest.>",
    "support_tarots": [<3 different tarot card numbers that support/complement the main card>],
    "challenge_tarots": [<3 different tarot card numbers that represent challenges or things to be mindful of>],
    "support_reasons": ["<reason for support card 1>", "<reason for support card 2>", "<reason for support card 3>"],
    "challenge_reasons": ["<reason for challenge card 1>", "<reason for challenge card 2>", "<reason for challenge card 3>"]
}

The user's current language preference is: {$langName}. Respond in this language.
Important rules:
- All tarot numbers must be from 1 to 78
- support_tarots and challenge_tarots must each contain exactly 3 different numbers
- None of the support or challenge numbers should be the same as the main_tarot_number
- Make the reading deeply personal based on what the user shared
- Be mystical and enchanting in tone, but also practical and encouraging
PROMPT;

        $lastError = null;

        foreach ($this->modelNames as $modelName) {
            try {
                Log::info("Attempting tarot generation with model: {$modelName}");
                
                $response = Http::timeout(60)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                    ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $userInput]
                            ]
                        ]
                    ],
                    'system_instruction' => [
                        'parts' => [
                            ['text' => $systemInstruction]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.8,
                        'topP' => 0.95,
                        'topK' => 40,
                        'maxOutputTokens' => 2048,
                        'responseMimeType' => 'application/json',
                    ],
                ]);

                if (!$response->successful()) {
                    $errorData = $response->json();
                    $errorMessage = $errorData['error']['message'] ?? 'Unknown API error';
                    Log::warning("Gemini model {$modelName} failed", ['error' => $errorMessage]);
                    $lastError = new \Exception("Model {$modelName} failed: {$errorMessage}");
                    continue;
                }

                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if (!$text) {
                    Log::warning("Gemini model {$modelName} returned empty text");
                    continue;
                }

                // Parse the JSON response
                $reading = json_decode($text, true);

                if (!$reading || !isset($reading['main_tarot_number'])) {
                    Log::error('Invalid Gemini response format', ['text' => $text]);
                    throw new \Exception('Invalid AI response format');
                }

                // Resolve tarot details
                $mainTarot = $tarots->firstWhere('number', $reading['main_tarot_number']);
                if (!$mainTarot) {
                    $mainTarot = $tarots->random();
                }

                $supportTarots = collect($reading['support_tarots'])->map(function ($number, $index) use ($tarots, $reading) {
                    $tarot = $tarots->firstWhere('number', $number);
                    if (!$tarot) $tarot = $tarots->random();
                    return [
                        'id' => $tarot->id,
                        'number' => $tarot->number,
                        'name' => $tarot->name,
                        'image' => $tarot->image,
                        'reason' => $reading['support_reasons'][$index] ?? 'This card supports your journey.',
                    ];
                })->toArray();

                $challengeTarots = collect($reading['challenge_tarots'])->map(function ($number, $index) use ($tarots, $reading) {
                    $tarot = $tarots->firstWhere('number', $number);
                    if (!$tarot) $tarot = $tarots->random();
                    return [
                        'id' => $tarot->id,
                        'number' => $tarot->number,
                        'name' => $tarot->name,
                        'image' => $tarot->image,
                        'reason' => $reading['challenge_reasons'][$index] ?? 'Be mindful of this energy.',
                    ];
                })->toArray();

                Log::info("Success with model: {$modelName}");

                return [
                    'main_tarot_id' => $mainTarot->id,
                    'main_tarot_name' => $mainTarot->name,
                    'short_explanation' => $reading['short_explanation'],
                    'long_explanation' => $reading['long_explanation'],
                    'support_tarots' => $supportTarots,
                    'challenge_tarots' => $challengeTarots,
                ];

            } catch (\Exception $e) {
                $lastError = $e;
                Log::error("Error with model {$modelName}: " . $e->getMessage());
                continue;
            }
        }

        // If all models failed
        Log::error('All Gemini models failed to respond', [
            'last_error' => $lastError ? $lastError->getMessage() : 'Unknown error'
        ]);
        throw $lastError ?: new \Exception('Failed to get response from AI');
    }
}
