
<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Check administrator login
if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Unauthorized access."
    ]);

    exit;
}

// Only POST requests are allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}

$staffId = filter_input(INPUT_POST, "staff_id", FILTER_VALIDATE_INT);
$status = trim($_POST["status"] ?? "");

// Validate input
if (!$staffId || !in_array($status, ["Approved", "Rejected"], true)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid staff registration information."
    ]);

    exit;
}

// Only update accounts that are still pending.
// Prevent administrators from changing their own account status.
$stmt = $conn->prepare(
    "UPDATE admins
     SET status = ?
     WHERE id = ?
     AND status = 'Pending'
     AND id != ?"
);

$stmt->bind_param("sii", $status, $staffId, $_SESSION["admin_id"]);

if ($stmt->execute() && $stmt->affected_rows === 1) {
    echo json_encode([
        "success" => true,
        "message" => "Staff account " . strtolower($status) . " successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Unable to update this staff account. It may no longer be pending."
    ]);
}

$stmt->close();
$conn->close();
?>
