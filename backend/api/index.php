<?php
if (isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL'])) {
    // Trik Sakti Vercel Serverless (Read-Only Filesystem Fix)
    putenv('APP_SERVICES_CACHE=/tmp/cache/services.php');
    putenv('APP_PACKAGES_CACHE=/tmp/cache/packages.php');
    putenv('APP_CONFIG_CACHE=/tmp/cache/config.php');
    putenv('APP_ROUTES_CACHE=/tmp/cache/routes-v7.php');
    putenv('APP_EVENTS_CACHE=/tmp/cache/events.php');
    @mkdir('/tmp/cache', 0777, true);
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
