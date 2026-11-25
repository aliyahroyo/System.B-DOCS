
<?php
session_start();
require_once "db.php";

header("Content-Type: application/json; charset=UTF-8");

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Please enter your email and password."
    ]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT id, full_name, email, password, status
     FROM admins
     WHERE email = ?
     LIMIT 1"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();

    if (password_verify($password, $admin["password"])) {

        // Check account approval status
        if ($admin["status"] === "Pending") {
            echo json_encode([
                "success" => false,
                "message" => "Your staff registration is still waiting for administrator approval."
            ]);

        } elseif ($admin["status"] === "Rejected") {
            echo json_encode([
                "success" => false,
                "message" => "Your staff registration was rejected. Please contact the administrator."
            ]);

        } elseif ($admin["status"] === "Approved") {

            session_regenerate_id(true);

            $_SESSION["admin_id"] = $admin["id"];
            $_SESSION["admin_name"] = $admin["full_name"];
            $_SESSION["admin_email"] = $admin["email"];

            echo json_encode([
                "success" => true,
                "message" => "Login successful."
            ]);

        } else {
            echo json_encode([
                "success" => false,
                "message" => "Your account status is invalid. Please contact the administrator."
            ]);
        }

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect email or password."
        ]);
    }

} else {
    echo json_encode([
        "success" => false,
        "message" => "Incorrect email or password."
    ]);
}

$stmt->close();
$conn->close();
?>
