
<?php

session_start();
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Allow POST requests only
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

// Read JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request data."
    ]);
    exit;
}

$reference = trim($data["reference"] ?? "");
$status = trim($data["status"] ?? "");
$rejectionReason = trim($data["rejectionReason"] ?? "");

$allowedStatuses = [
    "Pending",
    "Approved",
    "Processing",
    "Completed",
    "Rejected"
];

// Validate request information
if (
    $reference === "" ||
    !in_array($status, $allowedStatuses, true)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request reference or status."
    ]);
    exit;
}

if ($status === "Rejected" && $rejectionReason === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "A rejection reason is required."
    ]);
    exit;
}

try {

    $conn->begin_transaction();

    // Find the request and its resident
    $check = $conn->prepare(
        "SELECT id, resident_id, status, document
 FROM document_requests
 WHERE reference = ?
 LIMIT 1"
    );

    $check->bind_param("s", $reference);
    $check->execute();

    $result = $check->get_result();
    $request = $result->fetch_assoc();

    $check->close();

    if (!$request) {
        $conn->rollback();

        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Request not found."
        ]);
        exit;
    }

    $requestId = (int) $request["id"];
$residentId = $request["resident_id"];
$oldStatus = $request["status"];
$document = $request["document"];

    $reasonToSave = $status === "Rejected"
        ? $rejectionReason
        : "";

    // Update request status
    $update = $conn->prepare(
        "UPDATE document_requests
         SET status = ?, rejection_reason = ?
         WHERE reference = ?"
    );

    $update->bind_param(
        "sss",
        $status,
        $reasonToSave,
        $reference
    );

    $update->execute();
    $update->close();

    // Create a notification only when the status changes
    if (
        !empty($residentId) &&
        $oldStatus !== $status
    ) {

        $title = "Request " . $status;

        if ($status === "Rejected") {
            $message = "Your request for " . $document .
                " has been rejected. Reason: " . $reasonToSave;
        } elseif ($status === "Approved") {
            $message = "Your request for " . $document .
                " has been approved.";
        } elseif ($status === "Processing") {
            $message = "Your request for " . $document .
                " is now being processed.";
        } elseif ($status === "Completed") {
            $message = "Your request for " . $document .
                " has been completed.";
        } else {
            $message = "Your request for " . $document .
                " is now " . strtolower($status) . ".";
        }

       $notification = $conn->prepare(
    "INSERT INTO notifications
     (resident_id, request_id, title, message, is_read)
     VALUES (?, ?, ?, ?, 0)"
);

$notification->bind_param(
    "iiss",
    $residentId,
    $requestId,
    $title,
    $message
);

        $notification->execute();
        $notification->close();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Request status updated successfully.",
        "reference" => $reference,
        "status" => $status,
        "rejectionReason" => $reasonToSave
    ]);

} catch (mysqli_sql_exception $e) {

    $conn->rollback();

    error_log("Request status update error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update request status."
    ]);
}

$conn->close();

?>
