<?php
// Allow requests from your React dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$firstname = $data['firstname'];
$lastname  = $data['lastname'];
$birthday  = $data['birthday'];
$gender    = $data['gender'];
$username  = $data['username'];
$email     = $data['email'];
$phone     = $data['phone'];
$password  = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (firstname, lastname, birthday, gender, username, email, phone, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssss", $firstname, $lastname, $birthday, $gender, $username, $email, $phone, $password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
