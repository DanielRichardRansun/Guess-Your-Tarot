<?php

namespace App\Http\Controllers;

use App\Models\SocialConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $user->load(['currentTarot', 'socialConnections']);

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . Auth::id(),
            'avatar' => 'sometimes|string|max:500',
        ]);

        $user = $request->user();
        $user->update($request->only(['name', 'email', 'avatar']));

        return response()->json($user);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function socialConnections(Request $request)
    {
        $connections = SocialConnection::where('user_id', Auth::id())->get();

        return response()->json($connections);
    }

    public function disconnectSocial(Request $request, string $provider)
    {
        SocialConnection::where('user_id', Auth::id())
            ->where('provider', $provider)
            ->delete();

        return response()->json(['message' => "Disconnected from {$provider}"]);
    }
}
