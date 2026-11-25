
<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Unauthorized access."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "SELECT id, first_name, middle_name, last_name,
            position, email, phone, status, created_at
     FROM admins
     WHERE position IS NOT NULL
       AND position != ''
     ORDER BY created_at DESC"
);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve staff registrations."
    ]);

    exit;
}

$stmt->execute();

$result = $stmt->get_result();

$staff = [];

while ($row = $result->fetch_assoc()) {
    $staff[] = $row;
}

echo json_encode([
    "success" => true,
    "staff" => $staff
]);

$stmt->close();
$conn->close();
?>
