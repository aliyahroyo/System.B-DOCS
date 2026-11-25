
<?php
session_start();
require_once "db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized access."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$notificationId = intval($data["notification_id"] ?? 0);

if ($notificationId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid notification ID."
    ]);
    exit;
}

$sql = "UPDATE notifications
        SET is_read = 1
        WHERE id = ?
        AND resident_id IS NULL
        AND staff_id IS NULL";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $notificationId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Unable to update notification."
    ]);
}

$stmt->close();
$conn->close();
?>
