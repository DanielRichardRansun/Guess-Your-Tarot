<?php
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
