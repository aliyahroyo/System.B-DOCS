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
    <title>B-DOCS | Admin Reports</title>
    <link rel="stylesheet" href="style.css?v=admin-button-design-2">
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

    <section class="reports-heading">
        <a href="admin.php" class="admin-dashboard-back-button">
            ← Back to Dashboard
        </a>
        <h1>Reports and Statistics</h1>
        <p>Monitor document requests and application performance.</p>
    </section>

    <section class="report-stats">

    <div class="report-card">
        <p>Total Requests</p>
        <h2 id="reportTotal">0</h2>
        <span>All applications</span>
    </div>

    <div class="report-card">
        <p>Approved</p>
        <h2 class="green-text" id="reportApproved">0</h2>
        <span>Approved applications</span>
    </div>

    <div class="report-card">
        <p>Rejected</p>
        <h2 class="red-text" id="reportRejected">0</h2>
        <span>Rejected applications</span>
    </div>

    <div class="report-card">
        <p>Completed</p>
        <h2 class="blue-text" id="reportCompleted">0</h2>
        <span>Released documents</span>
    </div>

</section>

    <section class="report-panel">
    <h2>Request Status Overview</h2>
    <p class="report-subtitle">Actual distribution of document requests</p>

    <div class="report-bar-item">
        <div class="report-bar-label">
            <span>Pending</span>
            <strong id="reportPendingText">0 (0%)</strong>
        </div>
        <div class="report-bar">
            <div class="bar-fill" id="reportPendingBar"
                 style="width:0%"></div>
        </div>
    </div>

    <div class="report-bar-item">
        <div class="report-bar-label">
            <span>Approved</span>
            <strong id="reportApprovedText">0 (0%)</strong>
        </div>
        <div class="report-bar">
            <div class="bar-fill approved-fill" id="reportApprovedBar"
                 style="width:0%"></div>
        </div>
    </div>

    <div class="report-bar-item">
        <div class="report-bar-label">
            <span>Processing</span>
            <strong id="reportProcessingText">0 (0%)</strong>
        </div>
        <div class="report-bar">
            <div class="bar-fill" id="reportProcessingBar"
                 style="width:0%"></div>
        </div>
    </div>

    <div class="report-bar-item">
        <div class="report-bar-label">
            <span>Completed</span>
            <strong id="reportCompletedText">0 (0%)</strong>
        </div>
        <div class="report-bar">
            <div class="bar-fill completed-fill" id="reportCompletedBar"
                 style="width:0%"></div>
        </div>
    </div>

    <div class="report-bar-item">
        <div class="report-bar-label">
            <span>Rejected</span>
            <strong id="reportRejectedText">0 (0%)</strong>
        </div>
        <div class="report-bar">
            <div class="bar-fill rejected-fill" id="reportRejectedBar"
                 style="width:0%"></div>
        </div>
    </div>
</section>

   <section class="report-panel">
    <h2>Document Request Summary</h2>

    <div class="report-table-wrapper">
        <table class="report-table">
            <thead>
                <tr>
                    <th>Document Type</th>
                    <th>Total</th>
                    <th>Completed</th>
                </tr>
            </thead>

            <tbody id="reportDocumentSummary">
                <tr>
                    <td colspan="3">Loading report data...</td>
                </tr>
            </tbody>
        </table>
    </div>
</section>

    <footer class="admin-footer">
        B-DOCS Admin Portal • Version 1.0
    </footer>

</main>

<script src="script.js"></script>
</body>
</html>
