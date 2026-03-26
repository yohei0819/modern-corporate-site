<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Recruit API',
        'version' => '1.0.1',
        'status' => 'ok',
    ]);
});

// Temporary diagnostic endpoint - remove after debugging
Route::get('/debug-health', function () {
    $result = [
        'php' => PHP_VERSION,
        'laravel' => app()->version(),
        'db_default' => config('database.default'),
        'db_url_set' => !empty(env('DATABASE_URL')),
        'db_host' => config('database.connections.pgsql.host'),
        'db_port' => config('database.connections.pgsql.port'),
        'db_database' => config('database.connections.pgsql.database'),
        'db_username' => config('database.connections.pgsql.username'),
        'session_driver' => config('session.driver'),
        'cache_store' => config('cache.default'),
    ];

    try {
        DB::connection()->getPdo();
        $result['db_connection'] = 'success';
        $result['db_tables'] = DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    } catch (\Throwable $e) {
        $result['db_connection'] = 'failed';
        $result['db_error'] = $e->getMessage();
    }

    return response()->json($result);
})->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);
