
<?php
require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");

$firstName = trim($_POST["first_name"] ?? "");
$middleName = trim($_POST["middle_name"] ?? "");
$lastName = trim($_POST["last_name"] ?? "");
$position = trim($_POST["position"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$password = $_POST["password"] ?? "";

if (
    $firstName === "" ||
    $lastName === "" ||
    $position === "" ||
    $email === "" ||
    $phone === "" ||
    $password === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "Please complete all required fields."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address."
    ]);
    exit;
}

if (!preg_match("/^09[0-9]{9}$/", $phone)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid phone number."
    ]);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode([
        "success" => false,
        "message" => "Password must contain at least 8 characters."
    ]);
    exit;
}

// Check if email already exists
$check = $conn->prepare(
    "SELECT id FROM admins WHERE email = ? LIMIT 1"
);

$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "This email is already registered."
    ]);
    $check->close();
    $conn->close();
    exit;
}

$check->close();

// Combine the name for existing full_name compatibility
$fullName = trim(
    $firstName . " " . $middleName . " " . $lastName
);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$status = "Pending";

$stmt = $conn->prepare(
    "INSERT INTO admins
    (full_name, first_name, middle_name, last_name,
     position, email, phone, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssssssss",
    $fullName,
    $firstName,
    $middleName,
    $lastName,
    $position,
    $email,
    $phone,
    $hashedPassword,
    $status
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Registration submitted. Your account is awaiting administrator approval."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Unable to submit registration."
    ]);
}

$stmt->close();
$conn->close();
?>
