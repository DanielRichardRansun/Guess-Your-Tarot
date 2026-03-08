<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = config('services.gemini.api_key');
if (empty($apiKey)) {
    echo "API Key is empty\n";
    exit;
}

$models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash'];
foreach ($models as $model) {
    try {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent?key=' . $apiKey;
        $response = Illuminate\Support\Facades\Http::withHeaders(['Content-Type' => 'application/json'])
            ->post($url, ['contents' => [['parts' => [['text' => 'Hello']]]]]);
        echo $model . ': ' . $response->status() . " \n";
        
        $body = json_decode($response->body(), true);
        if (isset($body['error'])) {
            echo "  Error: " . $body['error']['message'] . "\n";
        }
    } catch (Exception $e) {
        echo $model . ": Exception - " . $e->getMessage() . "\n";
    }
}
