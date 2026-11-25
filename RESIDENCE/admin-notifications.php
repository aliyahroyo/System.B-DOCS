<?php
session_start();

if (!isset($_SESSION["admin_id"])) {
    header("Location: admin-login.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B-DOCS | Admin Notifications</title>
    <link rel="stylesheet" href="style.css?v=admin-button-design">
</head>
<body>

<main class="admin-container">

    <header class="admin-header">
        <div class="admin-brand">
            <div class="admin-logo">B</div>
            <div>
                <h2>B-DOCS</h2>
                <p>Barangay Admin Portal</p>
            </div>
        </div>

        <button class="admin-logout" onclick="adminLogout()">
            Log Out
        </button>
    </header>

    <section class="notification-heading">
        <a href="admin.php" class="admin-dashboard-back-button">
            ← Back to Dashboard
        </a>
        <h1>Notifications</h1>
        <p>Stay updated with resident document requests.</p>
    </section>

   
<section class="notification-card">

    <div class="notification-top">
        <h2>Recent Notifications</h2>
        <button onclick="markAllRead()">Mark All as Read</button>
    </div>

    <div id="adminNotificationsList">
        <p>Loading notifications...</p>
    </div>

<!-- ADMIN NOTIFICATION PAGINATION -->
<div id="adminNotificationPagination"
     class="admin-notification-pagination"
     hidden>

    <button type="button" id="previousAdminNotification">
        Previous
    </button>

    <span id="adminNotificationPageInfo">Page 1 of 1</span>

    <button type="button" id="nextAdminNotification">
        Next
    </button>

</div>

</section>


    </section>

    <footer class="admin-footer">
        B-DOCS Admin Portal • Version 1.0
    </footer>

</main>

<script src="script.js"></script>
</body>
</html>
