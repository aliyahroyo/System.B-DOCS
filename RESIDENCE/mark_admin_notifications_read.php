
<?php
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Admin login required."
    ]);
    exit;
}

require_once "db.php";

$sql = "UPDATE notifications
        SET is_read = 1
        WHERE resident_id IS NULL
        AND staff_id IS NULL
        AND is_read = 0";

if ($conn->query($sql)) {
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

$conn->close();
?>

