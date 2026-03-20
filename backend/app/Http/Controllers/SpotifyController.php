<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpotifyController extends Controller
{
    public function redirect()
    {
        $clientId = config('services.spotify.client_id');
        $redirectUri = config('services.spotify.redirect');
        
        $scopes = 'user-top-read user-read-recently-played';
        
        $url = "https://accounts.spotify.com/authorize?" . http_build_query([
            'client_id' => $clientId,
            'response_type' => 'code',
            'redirect_uri' => $redirectUri,
            'scope' => $scopes,
            'show_dialog' => 'true',
        ]);
        
        return response()->json(['url' => $url]);
    }

    public function callback(Request $request)
    {
        $code = $request->query('code');
        $error = $request->query('error');
        
        if ($error || !$code) {
            return response("<script>window.opener.postMessage({ source: 'guess-your-tarot', type: 'spotify_auth_error', error: 'Authentication failed' }, '*'); window.close();</script>")->header('Content-Type', 'text/html');
        }

        return response("
            <html><body>
            <script>
                window.opener.postMessage({ source: 'guess-your-tarot', type: 'spotify_auth_success', code: '{$code}' }, '*');
                window.close();
            </script>
            <p>Authentication successful! You can close this window and return to the app.</p>
            </body></html>
        ")->header('Content-Type', 'text/html');
    }
}
