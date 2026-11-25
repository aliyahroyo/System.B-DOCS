
<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$sql = "SELECT
            dr.id,
            dr.reference,
            r.full_name AS name,
            r.email AS email,
            r.phone AS phone,
            dr.document,
            dr.purpose,
            dr.attachments,
            dr.status,
            dr.rejection_reason,
            dr.created_at
        FROM document_requests dr
        LEFT JOIN residents r
            ON dr.resident_id = r.id
        ORDER BY dr.created_at DESC";

       

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve requests."
    ]);

    exit;
}

$requests = [];

while ($row = $result->fetch_assoc()) {

    $row["attachments"] = json_decode(
        $row["attachments"] ?? "[]",
        true
    );

    $requests[] = $row;
}

echo json_encode([
    "success" => true,
    "requests" => $requests
]);

$conn->close();

?>
