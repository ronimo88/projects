<?php
$host = 'localhost';
$dbname = 'file_router';
$dbusername = 'root';
$dbpassword = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    $_SESSION["connection_failed"] = $e->getMessage();
    header("Location: error.php");
    
}


