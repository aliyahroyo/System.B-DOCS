<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["resident_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in to continue."
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid profile data."
    ]);
    exit;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");

if ($name === "" || $email === "" || $phone === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please complete all profile fields."
    ]);
    exit;
}

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

require_once "db.php";

$residentId = (int) $_SESSION["resident_id"];

try {
    $check = $conn->prepare(
        "SELECT id FROM residents WHERE email = ? AND id <> ? LIMIT 1"
    );
    $check->bind_param("si", $email, $residentId);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $check->close();
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "This email address is already registered."
        ]);
        $conn->close();
        exit;
    }

    $check->close();

    $stmt = $conn->prepare(
        "UPDATE residents
         SET full_name = ?, email = ?, phone = ?
         WHERE id = ?"
    );
    $stmt->bind_param("sssi", $name, $email, $phone, $residentId);
    $stmt->execute();
    $stmt->close();

    $_SESSION["resident_email"] = $email;

    echo json_encode([
        "success" => true,
        "resident" => [
            "id" => $residentId,
            "name" => $name,
            "email" => $email,
            "phone" => $phone
        ]
    ]);
} catch (mysqli_sql_exception $e) {
    error_log("Resident profile update error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to save profile changes."
    ]);
}

$conn->close();
?>
