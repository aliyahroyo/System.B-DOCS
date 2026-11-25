
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

$sql = "SELECT
            n.id,
            n.request_id,
            dr.reference,
            n.title,
            n.message,
            n.is_read,
            n.created_at
        FROM notifications n
        LEFT JOIN document_requests dr
            ON n.request_id = dr.id
        WHERE n.resident_id IS NULL
        AND n.staff_id IS NULL
        ORDER BY n.created_at DESC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve notifications."
    ]);
    exit;
}

$notifications = [];

while ($row = $result->fetch_assoc()) {
    $row["is_read"] = (int) $row["is_read"];
    $notifications[] = $row;
}

echo json_encode([
    "success" => true,
    "notifications" => $notifications
]);

$conn->close();
?>
