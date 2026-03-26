<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Recruit API',
        'version' => '1.0.1',
        'status' => 'ok',
    ]);
});
