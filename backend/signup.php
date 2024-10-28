<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:8081");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  exit(0); // End execution for preflight requests
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_registration";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the posted data
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
    // Extract the data
    $request = json_decode($postdata);
    
    // Sanitize
    $fullname = mysqli_real_escape_string($conn, trim($request->fullname));
    $birthday = mysqli_real_escape_string($conn, trim($request->birthday));
    $gender = mysqli_real_escape_string($conn, trim($request->gender));
    $address = mysqli_real_escape_string($conn, trim($request->address));
    $contact = mysqli_real_escape_string($conn, trim($request->contact));
    $password = password_hash($request->password, PASSWORD_DEFAULT); // Hash the password
    
    // Store
    $sql = "INSERT INTO users (fullname, birthday, gender, address, contact, password) 
            VALUES ('$fullname', '$birthday', '$gender', '$address', '$contact', '$password')";
    
    if($conn->query($sql) === TRUE) {
        http_response_code(201);
        echo json_encode(["message" => "User registered successfully."]);
    } else {
        http_response_code(422);
        echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

$conn->close();