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

require_once "db.php";

$residentId = (int) $_SESSION["resident_id"];
$stmt = $conn->prepare(
    "UPDATE notifications
     SET is_read = 1
     WHERE resident_id = ?
     AND is_read = 0"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update notifications."
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("i", $residentId);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "All notifications marked as read."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update notifications."
    ]);
}

$stmt->close();
$conn->close();
?>
