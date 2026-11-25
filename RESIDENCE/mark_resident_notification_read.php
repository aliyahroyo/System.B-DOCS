
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Check resident login
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
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

$residentId = (int) $_SESSION["resident_id"];

// Receive notification ID
$data = json_decode(file_get_contents("php://input"), true);
$notificationId = (int) ($data["notification_id"] ?? 0);

if ($notificationId <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid notification ID."
    ]);
    exit;
}

// Mark only this resident's notification as read
$stmt = $conn->prepare(
    "UPDATE notifications
     SET is_read = 1
     WHERE id = ? AND resident_id = ?"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update notification."
    ]);
    exit;
}

$stmt->bind_param("ii", $notificationId, $residentId);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to mark notification as read."
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "message" => "Notification marked as read."
]);

?>
