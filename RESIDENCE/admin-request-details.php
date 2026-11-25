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
    <title>B-DOCS | Request Details</title>
    <link rel="stylesheet" href="style.css">
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

    <section class="details-heading">
        <a href="admin-requests.html">← Back to Requests</a>
        <h1>Request Details</h1>
        <p>Review the resident's document application.</p>
    </section>

    <section class="request-details-card">

        <div class="details-top">
            <div>
                <span class="request-number" id="detailReference">Loading...</span>
                <h2 id="detailDocument">Loading...</h2>
            </div>

            <span class="status pending" id="requestStatus">Pending</span>
        </div>

        <hr>

        <h3>Resident Information</h3>

        <div class="details-grid">
            <div>
                <label>Full Name</label>
                <p id="detailName">-</p>
            </div>

            <div>
                <label>Email Address</label>
                <p id="detailEmail">-</p>
            </div>

            <div>
                <label>Phone Number</label>
                <p id="detailPhone">-</p>
            </div>

            <div>
                <label>Request Number</label>
                <p id="detailRequestNumber">-</p>
            </div>
        </div>

        <hr>

        <h3>Application Information</h3>

        <div class="details-grid">
            <div>
                <label>Document Requested</label>
                <p id="detailDocumentInfo">-</p>
            </div>

            

            <div>
                <label>Date Submitted</label>
                <p id="detailDate">-</p>
            </div>

            <div>
                <label>Current Status</label>
                <p id="detailCurrentStatus">-</p>
            </div>
        </div>

        <div class="details-purpose">
            <label>Purpose of Request</label>
            <p id="detailPurpose">-</p>
        </div>

        <div class="details-purpose">
         <label>Uploaded Attachments</label>
        <div id="detailAttachments">
        Loading attachments...
        </div>
</div>
<!-- ATTACHMENT PREVIEW MODAL -->
<div id="attachmentPreviewModal" class="attachment-modal" hidden>

    <div class="attachment-modal-content">

        <div class="attachment-modal-header">
            <h3 id="attachmentPreviewTitle">Attachment Preview</h3>

            <button type="button"
                id="closeAttachmentPreview"
                class="attachment-close-btn"
                aria-label="Close preview">
                &times;
            </button>
        </div>

        <div id="attachmentPreviewBody" class="attachment-preview-body">
        </div>

        <div class="attachment-modal-footer">
            <a id="downloadAttachment"
                href="#"
                download
                class="attachment-download-btn">
                Download Attachment
            </a>
        </div>

    </div>

</div>

        <div class="details-purpose" id="savedRejectionSection" hidden>
            <label>Reason for Rejection</label>
            <p id="detailRejectionReason"></p>
        </div>

        <div class="details-note">
            <strong>Admin Reminder</strong>
            <p>
                Review the resident's information and requirements
                before approving or rejecting the application.
            </p>
        </div>

        <div class="decision-section">
            <h3>Review Application</h3>
            <p>Choose an action after reviewing the resident's information.</p>

            <button type="button"
                class="approve-btn"
                id="approveRequestButton"
                onclick="approveDatabaseRequest()">
                Approve Request
            </button>

            <button type="button"
                class="reject-btn"
                id="showRejectButton"
                onclick="showDatabaseRejectForm()">
                Reject Request
            </button>

            <div id="rejectForm" class="reject-form" hidden>
                <label for="rejectionReason">Reason for Rejection</label>

                <textarea id="rejectionReason"
                    placeholder="Explain why this request is rejected..."></textarea>

                <button type="button"
                    class="confirm-reject-btn"
                    onclick="rejectDatabaseRequest()">
                    Confirm Rejection
                </button>
            </div>

            <div id="decisionResult"
                class="decision-result"
                style="display:none;">
            </div>
        </div>

        <a href="admin-requests.html" class="details-back-btn">
            Return to Request Management
        </a>

    </section>

    <footer class="admin-footer">
        B-DOCS Admin Portal • Version 1.0
    </footer>

</main>

<script src="script.js"></script>
</body>
</html>
