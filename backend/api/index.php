<?php
// Trik Sakti Vercel: Penanganan CORS Cepat (Pra-penerbangan Browser)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

if (isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL'])) {
    // Trik Sakti Vercel Serverless (Read-Only Filesystem Fix)
    putenv('APP_SERVICES_CACHE=/tmp/cache/services.php');
    putenv('APP_PACKAGES_CACHE=/tmp/cache/packages.php');
    putenv('APP_CONFIG_CACHE=/tmp/cache/config.php');
    putenv('APP_ROUTES_CACHE=/tmp/cache/routes-v7.php');
    putenv('APP_EVENTS_CACHE=/tmp/cache/events.php');
    @mkdir('/tmp/cache', 0777, true);
}

// Fix prefix '/api' for Vercel Routing
$uri = $_SERVER['REQUEST_URI'];
if (strpos($uri, '/api') === 0) {
    $_SERVER['REQUEST_URI'] = substr($uri, 4) ?: '/';
}

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    header('Content-Type: text/plain');
    echo "VERCEL RAW ERROR DETECTED:\n";
    echo $e->getMessage() . "\n";
    echo $e->getFile() . " on line " . $e->getLine() . "\n\n";
    echo "Raw Stack Trace:\n";
    echo $e->getTraceAsString();
    exit;
}
