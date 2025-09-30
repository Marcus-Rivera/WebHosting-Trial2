<?php
$host = "127.0.0.1";
$user = "root";   // default in XAMPP
$pass = "";       // default in XAMPP
$db   = "tara_trabaho";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
