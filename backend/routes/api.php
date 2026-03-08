<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TarotController;
use App\Http\Controllers\TarotReadingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Tarot Library (public)
Route::get('/tarots', [TarotController::class, 'index']);
Route::get('/tarots/{id}', [TarotController::class, 'show']);

// Create reading (guest or authenticated)
Route::post('/readings', [TarotReadingController::class, 'create']);

// View reading by share slug (public)
Route::get('/readings/{slug}', [TarotReadingController::class, 'show']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // Reading history and favorites
    Route::get('/readings-history', [TarotReadingController::class, 'history']);
    Route::get('/readings-favorites', [TarotReadingController::class, 'favorites']);
    Route::post('/readings/{id}/favorite', [TarotReadingController::class, 'toggleFavorite']);

    // Social connections
    Route::get('/social-connections', [ProfileController::class, 'socialConnections']);
    Route::delete('/social-connections/{provider}', [ProfileController::class, 'disconnectSocial']);
});
