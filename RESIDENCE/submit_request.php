
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

// Check resident login
if (!isset($_SESSION["resident_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in to submit a request."
    ]);
    exit;
}

$residentId = (int) $_SESSION["resident_id"];

// Get the actual resident information from MySQL
$residentStmt = $conn->prepare(
    "SELECT full_name, email
     FROM residents
     WHERE id = ?
     LIMIT 1"
);

if (!$residentStmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Could not retrieve resident information."
    ]);
    exit;
}

$residentStmt->bind_param("i", $residentId);
$residentStmt->execute();

$residentResult = $residentStmt->get_result();
$resident = $residentResult->fetch_assoc();

$residentStmt->close();

if (!$resident) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Resident account not found."
    ]);
    exit;
}

$name = $resident["full_name"];
$email = $resident["email"];

// Get request information
$document = trim($_POST["document"] ?? "");
$purpose = trim($_POST["purpose"] ?? "");
/*$urgency = trim($_POST["urgency"] ?? "Later");*/

// Validate required information
if ($document === "" || $purpose === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Document type and purpose are required."
    ]);
    exit;
}

if (
    strlen($name) > 150 ||
    strlen($document) > 150
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "One or more fields are too long."
    ]);
    exit;
}

// Check uploaded attachments
if (
    !isset($_FILES["attachments"]) ||
    empty($_FILES["attachments"]["name"])
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please upload the required attachment."
    ]);
    exit;
}

$uploadDirectory = __DIR__ . "/uploads/";

if (!is_dir($uploadDirectory)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Uploads folder was not found."
    ]);
    exit;
}

// Allowed file extensions and MIME types
$allowedFiles = [
    "jpg" => ["image/jpeg"],
    "jpeg" => ["image/jpeg"],
    "png" => ["image/png"],
    "pdf" => ["application/pdf"],
    "doc" => ["application/msword"],
    "docx" => [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
];

$uploadedAttachments = [];
$files = $_FILES["attachments"];

$fileCount = is_array($files["name"])
    ? count($files["name"])
    : 1;

$finfo = new finfo(FILEINFO_MIME_TYPE);

// Process uploaded files
for ($i = 0; $i < $fileCount; $i++) {

    $originalName = is_array($files["name"])
        ? $files["name"][$i]
        : $files["name"];

    $temporaryName = is_array($files["tmp_name"])
        ? $files["tmp_name"][$i]
        : $files["tmp_name"];

    $fileSize = is_array($files["size"])
        ? $files["size"][$i]
        : $files["size"];

    $uploadError = is_array($files["error"])
        ? $files["error"][$i]
        : $files["error"];

    if ($uploadError !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "An attachment could not be uploaded."
        ]);
        exit;
    }

    // Maximum file size: 5 MB
    if ($fileSize > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Each attachment must not exceed 5 MB."
        ]);
        exit;
    }

    $extension = strtolower(
        pathinfo($originalName, PATHINFO_EXTENSION)
    );

    if (!isset($allowedFiles[$extension])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid attachment format."
        ]);
        exit;
    }

    $mimeType = $finfo->file($temporaryName);

    if (
        $mimeType === false ||
        !in_array($mimeType, $allowedFiles[$extension], true)
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "The uploaded file does not match its file extension."
        ]);
        exit;
    }

    // Generate a safe, unique filename
    $newFileName = bin2hex(random_bytes(16)) . "." . $extension;

    $destination = $uploadDirectory . $newFileName;

    if (!move_uploaded_file($temporaryName, $destination)) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Could not save an uploaded attachment."
        ]);
        exit;
    }

    $uploadedAttachments[] = [
        "original_name" => basename($originalName),
        "stored_name" => $newFileName
    ];
}

// Generate request reference
$reference = "RES-" . date("Ymd") . "-" .
    strtoupper(bin2hex(random_bytes(3)));

$status = "Pending";

// Store attachment information as JSON
$attachmentsJSON = json_encode($uploadedAttachments);

// Start database transaction
$conn->begin_transaction();

try {

    // Save document request with resident_id
  $sql = "INSERT INTO document_requests
        (resident_id, reference, name, email, document,
         purpose, attachments, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Could not prepare the request query.");
    }

    $stmt->bind_param(
        "isssssss",
        $residentId,
        $reference,
        $name,
        $email,
        $document,
        $purpose,
        $attachmentsJSON,
        $status
    );

    if (!$stmt->execute()) {
    throw new Exception("Failed to save the document request.");
}

// Get the ID of the newly submitted document request
$requestId = $conn->insert_id;

$stmt->close();

    // Create resident notification
    $notificationTitle = "Request Submitted";

    $notificationMessage =
        "Your " . $document .
        " request (Reference: " . $reference .
        ") was successfully submitted and is pending review.";

    $isRead = 0;

         $notificationSQL = "INSERT INTO notifications
                    (resident_id, request_id, title, message, is_read, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())";

    $notificationStmt = $conn->prepare($notificationSQL);

    if (!$notificationStmt) {
        throw new Exception("Could not prepare the notification query.");
    }

    $notificationStmt->bind_param(
    "iissi",
    $residentId,
    $requestId,
    $notificationTitle,
    $notificationMessage,
    $isRead
);
    

    if (!$notificationStmt->execute()) {
        throw new Exception("Could not save the notification.");
    }

    $notificationStmt->close();

    // Create admin notification for the new document request
    $adminNotificationTitle = "New Document Request";

    $adminNotificationMessage =
        $name . " submitted a " . $document .
        " request. Reference Number: " . $reference;

   $adminNotificationSQL = "INSERT INTO notifications
                         (resident_id, staff_id, request_id, title, message, is_read, created_at)
                         VALUES (NULL, NULL, ?, ?, ?, 0, NOW())";

    $adminNotificationStmt = $conn->prepare($adminNotificationSQL);

    if (!$adminNotificationStmt) {
        throw new Exception("Could not prepare the admin notification query.");
    }

   $adminNotificationStmt->bind_param(
    "iss",
    $requestId,
    $adminNotificationTitle,
    $adminNotificationMessage
);

    if (!$adminNotificationStmt->execute()) {
        throw new Exception("Could not save the admin notification.");
    }

    $adminNotificationStmt->close();

    // Save both database records
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Document request submitted successfully!",
        "reference" => $reference
    ]);

} catch (Exception $error) {

    // Undo database changes
    $conn->rollback();

    // Delete uploaded files if the transaction fails
    foreach ($uploadedAttachments as $attachment) {

        $path = $uploadDirectory . $attachment["stored_name"];

        if (file_exists($path)) {
            unlink($path);
        }
    }

    error_log("Request submission error: " . $error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to submit your request. Please try again."
    ]);
}

$conn->close();

?>
