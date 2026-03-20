<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class SpotifyService
{
    public function getSpotifyData(string $code): array
    {
        $clientId = config('services.spotify.client_id');
        $clientSecret = config('services.spotify.client_secret');
        $redirectUri = config('services.spotify.redirect');

        // Exchange code for token
        $response = Http::asForm()->withBasicAuth($clientId, $clientSecret)->post('https://accounts.spotify.com/api/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $redirectUri,
        ]);

        if (!$response->successful()) {
            throw new Exception("Failed to exchange Spotify token: " . $response->body());
        }

        $token = $response->json('access_token');

        // Get Top Tracks
        $tracksResponse = Http::withToken($token)->get('https://api.spotify.com/v1/me/top/tracks', [
            'time_range' => 'short_term',
            'limit' => 5
        ]);
        
        // Get Top Artists
        $artistsResponse = Http::withToken($token)->get('https://api.spotify.com/v1/me/top/artists', [
            'time_range' => 'short_term',
            'limit' => 5
        ]);

        $tracks = [];
        $tracksItems = $tracksResponse->json('items');
        if ($tracksResponse->successful() && $tracksItems !== null) {
            foreach ((array)$tracksItems as $track) {
                if(isset($track['name']) && isset($track['artists'][0]['name'])) {
                    $tracks[] = $track['name'] . ' by ' . $track['artists'][0]['name'];
                }
            }
        }

        $artists = [];
        $artistsItems = $artistsResponse->json('items');
        if ($artistsResponse->successful() && $artistsItems !== null) {
            foreach ((array)$artistsItems as $artist) {
                if(isset($artist['name'])) {
                    $artists[] = $artist['name'];
                }
            }
        }

        return [
            'top_tracks' => $tracks,
            'top_artists' => $artists,
        ];
    }
}
