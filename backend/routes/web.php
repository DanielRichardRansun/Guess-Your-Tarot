<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Backend is working perfectly!', 'version' => '1.0']);
});
