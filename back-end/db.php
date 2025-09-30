<?php
// db.php
$host = "127.0.0.1";     // database host (XAMPP/MAMP usually localhost)
$user = "root";          // MySQL username (default is root in XAMPP)
$pass = "";              // MySQL password (default empty in XAMPP)
$dbname = "tratrabaho"; // your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// If you just want to test connection:
echo json_encode([
    "status" => "success",
    "message" => "Database connected successfully"
]);
?>
