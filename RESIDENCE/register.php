
<?php

header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Receive JSON from JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid registration data."
    ]);
    exit;
}

// Get form values
$firstName = trim($data["firstName"] ?? "");
$middleName = trim($data["middleName"] ?? "");
$surname = trim($data["surname"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$password = $data["password"] ?? "";

// Check required fields
if (
    $firstName === "" ||
    $surname === "" ||
    $email === "" ||
    $phone === "" ||
    $password === ""
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please complete all required fields."
    ]);
    exit;
}

// Validate email and phone
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address."
    ]);
    exit;
}

if (!preg_match("/^09[0-9]{9}$/", $phone)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid phone number."
    ]);
    exit;
}

// Validate password
if (
    strlen($password) < 8 ||
    !preg_match("/[A-Z]/", $password) ||
    !preg_match("/[a-z]/", $password) ||
    !preg_match("/[0-9]/", $password) ||
    !preg_match("/[^A-Za-z0-9]/", $password)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password does not meet all requirements."
    ]);
    exit;
}

try {

    // Check duplicate email
    $check = $conn->prepare(
        "SELECT id FROM residents WHERE email = ?"
    );

    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $check->close();

        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "This email address is already registered."
        ]);
        exit;
    }

    $check->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Combine full name
    $fullName = trim(
        $firstName . " " .
        ($middleName !== "" ? $middleName . " " : "") .
        $surname
    );

    // Insert resident information
    $stmt = $conn->prepare(
        "INSERT INTO residents
        (full_name, first_name, middle_name, surname, email, phone, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "sssssss",
        $fullName,
        $firstName,
        $middleName,
        $surname,
        $email,
        $phone,
        $hashedPassword
    );

    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Your account has been created successfully."
    ]);

} catch (mysqli_sql_exception $e) {

    error_log("Registration error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Registration failed. Please check your database structure."
    ]);
}

?>
