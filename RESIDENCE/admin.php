
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
    <title>B-DOCS | Admin Dashboard</title>
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

           <div class="admin-header-actions">

    <a href="admin-notifications.php"
       class="admin-notification-button"
       title="View Notifications">

        <span class="admin-bell">🔔</span>

        <span id="adminNotificationBadge"
              class="admin-notification-badge"
              hidden>
            0
        </span>

    </a>

    <button class="admin-logout" onclick="adminLogout()">
        Log Out
    </button>

</div>
        </header>

        
<section class="admin-welcome">
    <p>ADMIN DASHBOARD</p>
    <h1>Welcome, Barangay Staff!</h1>
    <span>Manage and monitor resident document requests.</span>

    <a href="admin-requests.html" class="manage-requests-btn">
        Manage Document Requests
    </a>
    <a href="admin-notifications.php" class="manage-requests-btn">
    View Notifications
</a>
<a href="admin-reports.php" class="manage-requests-btn">
    View Reports
</a>
</section>


<section class="admin-overview">
    <h2>Request Overview</h2>

    <div class="admin-stats">

        <div class="stat-card">
            <span class="stat-icon">📄</span>
            <p>Total Requests</p>
            <h3 id="totalRequests">0</h3>
        </div>

        <div class="stat-card">
            <span class="stat-icon">⏳</span>
            <p>Pending</p>
            <h3 id="pendingRequests">0</h3>
        </div>

        <div class="stat-card">
            <span class="stat-icon">✓</span>
            <p>Approved</p>
            <h3 id="approvedRequests">0</h3>
        </div>

        <div class="stat-card">
            <span class="stat-icon">⚙️</span>
            <p>Processing</p>
            <h3 id="processingRequests">0</h3>
        </div>

        <div class="stat-card">
            <span class="stat-icon">❌</span>
            <p>Rejected</p>
            <h3 id="rejectedRequests">0</h3>
        </div>

        <div class="stat-card">
            <span class="stat-icon">🎉</span>
            <p>Completed</p>
            <h3 id="completedRequests">0</h3>
        </div>

    </div>


<section class="admin-staff-approvals">

    <div class="admin-section-heading">
        <div>
            <h2>Staff Registration Management</h2>
            <p>Review and manage staff account registrations.</p>
        </div>
    </div>

    <div class="staff-approval-tabs">

        <button type="button" class="staff-tab active"
                data-status="Pending">
            Pending
            <span id="pendingStaffCount">0</span>
        </button>

        <button type="button" class="staff-tab"
                data-status="Approved">
            Approved
            <span id="approvedStaffCount">0</span>
        </button>

        <button type="button" class="staff-tab"
                data-status="Rejected">
            Rejected
            <span id="rejectedStaffCount">0</span>
        </button>

    </div>

    <div class="staff-search-container">
    <input
        type="search"
        id="staffSearchInput"
        placeholder="Search staff by name, email, or position..."
        autocomplete="off"
    >
</div>

<div id="staffApprovalList">
    <p>Loading staff registrations...</p>
</div>

    <p id="noStaffApprovals" hidden>
        No staff registrations found in this category.
    </p>

</section>


</section>

        
<section class="admin-requests">
    <div class="admin-section-heading">
        <div>
            <h2>Recent Requests</h2>
            <p>Review resident document applications.</p>
        </div>

        <a href="admin-requests.html" class="manage-requests-btn">
            View All Requests
        </a>
    </div>

    <div id="dashboardRecentRequests">
        <p>Loading recent requests...</p>
    </div>

    <p id="dashboardNoRequests" hidden>
        No resident requests found.
    </p>
</section>


        <footer class="admin-footer">
            B-DOCS Admin Portal • Version 1.0
        </footer>

    </main>


<!-- STAFF DETAILS MODAL -->
<div id="staffDetailsModal" class="staff-details-modal" hidden>
    <div class="staff-details-content">

        <div class="staff-details-header">
            <h2>Staff Details</h2>

            <button type="button"
                    id="closeStaffDetails"
                    class="staff-details-close">
                &times;
            </button>
        </div>

        <div class="staff-details-body">
            <p><strong>Full Name:</strong> <span id="detailStaffName"></span></p>
            <p><strong>Position:</strong> <span id="detailStaffPosition"></span></p>
            <p><strong>Email:</strong> <span id="detailStaffEmail"></span></p>
            <p><strong>Phone:</strong> <span id="detailStaffPhone"></span></p>
            <p><strong>Registration Date:</strong> <span id="detailStaffDate"></span></p>
            <p><strong>Registration Status:</strong> <span id="detailStaffStatus"></span></p>
        </div>

    </div>
</div>


<!-- STAFF DIRECTORY MODAL -->
<div id="staffDirectoryModal" class="staff-details-modal" hidden>
    <div class="staff-directory-content">

        <div class="staff-details-header">
            <h2 id="staffDirectoryTitle">Staff Directory</h2>

            <button type="button"
                    id="closeStaffDirectory"
                    class="staff-details-close"
                    aria-label="Close staff directory">
                &times;
            </button>
        </div>

        <div id="staffDirectoryList" class="staff-directory-list">
            <p>Loading staff members...</p>
        </div>

    </div>
</div>

<script src="script.js"></script>
</body>
</html>
