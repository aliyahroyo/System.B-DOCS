
<?php

session_start();
header("Content-Type: application/json");

require_once "db.php";

// Receive JSON data
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate required fields
if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please enter your email and password."
    ]);
    exit;
}

try {

    // Find resident by email
    $stmt = $conn->prepare(
        "SELECT id, first_name, middle_name, surname, email, password
         FROM residents
         WHERE email = ?"
    );

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $stmt->bind_result(
        $id,
        $firstName,
        $middleName,
        $surname,
        $residentEmail,
        $hashedPassword
    );

    $found = $stmt->fetch();
    $stmt->close();

    // Verify password
    if (!$found || !password_verify($password, $hashedPassword)) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Incorrect email or password."
        ]);
        exit;
    }

    // Create resident session
    session_regenerate_id(true);

    $_SESSION["resident_id"] = $id;
    $_SESSION["resident_email"] = $residentEmail;

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "resident" => [
            "id" => $id,
            "firstName" => $firstName,
            "middleName" => $middleName,
            "surname" => $surname,
            "email" => $residentEmail
        ]
    ]);

} catch (mysqli_sql_exception $e) {

    error_log("Login error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Login failed. Please try again."
    ]);
}

?>
