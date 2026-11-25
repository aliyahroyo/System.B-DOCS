
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

$residentId = (int) $_SESSION["resident_id"];

// Retrieve notifications belonging to the logged-in resident
$stmt = $conn->prepare(
    "SELECT id, request_id, title, message, is_read, created_at
 FROM notifications
 WHERE resident_id = ?
 ORDER BY created_at DESC"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve notifications."
    ]);

    exit;
}

$stmt->bind_param("i", $residentId);
$stmt->execute();

$result = $stmt->get_result();

$notifications = [];

while ($row = $result->fetch_assoc()) {

    $row["is_read"] = (bool) $row["is_read"];

    $notifications[] = $row;
}

$stmt->close();

echo json_encode([
    "success" => true,
    "notifications" => $notifications
]);

$conn->close();

?>
