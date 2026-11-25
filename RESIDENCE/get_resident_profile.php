
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Check if resident is logged in
if (!isset($_SESSION["resident_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Please log in to continue."
    ]);

    exit;
}

$residentId = $_SESSION["resident_id"];

// Retrieve resident information
$stmt = $conn->prepare(
    "SELECT id, first_name, middle_name, surname, full_name, email, phone
     FROM residents
     WHERE id = ?
     LIMIT 1"
);

$stmt->bind_param("i", $residentId);
$stmt->execute();

$result = $stmt->get_result();
$resident = $result->fetch_assoc();

$stmt->close();

if (!$resident) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Resident account not found."
    ]);

    exit;
}

// Return actual resident information
echo json_encode([
    "success" => true,
    "resident" => [
        "id" => $resident["id"],
        "name" => $resident["full_name"],
        "firstName" => $resident["first_name"],
        "middleName" => $resident["middle_name"],
        "surname" => $resident["surname"],
        "email" => $resident["email"],
        "phone" => $resident["phone"]
    ]
]);

$conn->close();

?>
