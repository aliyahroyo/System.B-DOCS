
// ==================================================
// RESIDENCE - COMPLETE JAVASCRIPT
// FEATURES 1-8 + INDIVIDUAL APPROVE AND REJECT BUTTONS
// ==================================================


// ==================================================
// RESIDENT LOGIN
// ==================================================

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginForm = document.getElementById("loginForm");

if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
        if (password.type === "password") {
            password.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            password.type = "password";
            togglePassword.textContent = "Show";
        }
    });
}

// FIXED: RESIDENT LOGIN CONNECTED TO login.php
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const passwordValue = document.getElementById("password").value;
        const loginError = document.getElementById("loginError");

        if (loginError) {
            loginError.textContent = "";
        }

        if (!email || !passwordValue) {
            if (loginError) {
                loginError.textContent =
                    "Please enter your email and password.";
            }
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (loginError) {
                loginError.textContent =
                    "Please enter a valid email address.";
            }
            return;
        }

        try {
            const response = await fetch("login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    email: email,
                    password: passwordValue
                })
            });

            const result = await response.json();

           if (!response.ok || !result.success) {
    if (loginError) {
        loginError.textContent =
            result.message || "Invalid email or password.";
    } else {
        alert(result.message || "Invalid email or password.");
    }
    return;
}

console.log("LOGIN ACCOUNT:", result.resident);

alert("Login successful!");
window.location.href = "home.html";

        } catch (error) {
            console.error("Login error:", error);

            if (loginError) {
                loginError.textContent =
                    "Unable to connect to the server. Please try again.";
            } else {
                alert("Unable to connect to the server. Please try again.");
            }
        }
    });
}

// ==================================================
// RESIDENT SIGNUP
// ==================================================

const signupForm = document.getElementById("signupForm");
const phone = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");

const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");

const passwordRequirements =
    document.getElementById("passwordRequirements");

const confirmPasswordError =
    document.getElementById("confirmPasswordError");

function setupPasswordVisibilityToggle(input, button) {
    if (!input || !button) return;

    button.addEventListener("click", function () {
        const showPassword = input.type === "password";
        input.type = showPassword ? "text" : "password";
        button.textContent = showPassword ? "🙈" : "👁";
        button.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );
        button.title = showPassword ? "Hide password" : "Show password";
    });
}

setupPasswordVisibilityToggle(
    signupPassword,
    document.getElementById("toggleSignupPassword")
);
setupPasswordVisibilityToggle(
    confirmPassword,
    document.getElementById("toggleConfirmPassword")
);

// PHONE NUMBER VALIDATION
if (phone) {
    phone.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 11);

        if (!/^09[0-9]{9}$/.test(this.value)) {
            if (phoneError) {
                phoneError.textContent =
                    "Invalid phone number. Enter exactly 11 digits starting with 09.";
            }
        } else {
            if (phoneError) phoneError.textContent = "";
        }
    });
}

// PASSWORD REQUIREMENT INDICATOR
function updateIndicator(id, isValid) {
    const indicator = document.getElementById(id);

    if (!indicator) return;

    const label = indicator.dataset.label;

    if (isValid) {
        indicator.style.color = "green";
        indicator.textContent = "✔ " + label;
    } else {
        indicator.style.color = "red";
        indicator.textContent = "❌ " + label;
    }
}

// CHECK PASSWORD STRENGTH
function checkPasswordStrength() {
    if (!signupPassword) return false;

    const value = signupPassword.value;

    const hasLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value);

    updateIndicator("lengthCheck", hasLength);
    updateIndicator("uppercaseCheck", hasUppercase);
    updateIndicator("lowercaseCheck", hasLowercase);
    updateIndicator("numberCheck", hasNumber);
    updateIndicator("specialCheck", hasSpecial);

    return hasLength && hasUppercase && hasLowercase &&
        hasNumber && hasSpecial;
}

// CHECK IF PASSWORDS MATCH
function checkConfirmPassword() {
    if (!signupPassword || !confirmPassword || !confirmPasswordError) {
        return false;
    }

    const passwordValue = signupPassword.value;
    const confirmValue = confirmPassword.value;

    if (confirmValue === "") {
        confirmPasswordError.textContent = "";
        return false;
    }

    if (passwordValue !== confirmValue) {
        confirmPasswordError.style.color = "red";
        confirmPasswordError.textContent = "Passwords do not match!";
        return false;
    }

    confirmPasswordError.style.color = "green";
    confirmPasswordError.textContent = "Passwords match!";

    return true;
}

// PASSWORD INPUT
if (signupPassword) {
    signupPassword.addEventListener("input", function () {
        if (passwordRequirements) {
            passwordRequirements.style.display =
                this.value.length > 0 ? "block" : "none";
        }

        checkPasswordStrength();
        checkConfirmPassword();
    });
}

// CONFIRM PASSWORD INPUT
if (confirmPassword) {
    confirmPassword.addEventListener("input", function () {
        checkConfirmPassword();
    });
}


// SIGNUP SUBMISSION
if (signupForm) {
    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const middleName = document.getElementById("middleName").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phoneNumber = phone.value.trim();
        const passwordValue = document.getElementById("signupPassword").value;
        const confirmValue = document.getElementById("confirmPassword").value;

        const signupMessage = document.getElementById("signupMessage");

        function showMessage(message, color = "red") {
            if (signupMessage) {
                signupMessage.textContent = message;
                signupMessage.style.color = color;
            } else {
                alert(message);
            }
        }

        if (signupMessage) signupMessage.textContent = "";

        if (!firstName || !surname || !email || !phoneNumber ||
            !passwordValue || !confirmValue) {
            showMessage("Please complete all required fields.");
            return;
        }

        if (!/^09[0-9]{9}$/.test(phoneNumber)) {
            showMessage("Invalid phone number. Enter exactly 11 digits starting with 09.");
            return;
        }

        if (!checkPasswordStrength()) {
            showMessage("Your password does not meet all the requirements.");
            return;
        }

        if (!checkConfirmPassword()) {
            showMessage("Your passwords do not match.");
            return;
        }

        try {
            const response = await fetch("register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    firstName: firstName,
                    middleName: middleName,
                    surname: surname,
                    email: email,
                    phone: phoneNumber,
                    password: passwordValue
                })
            });

            const responseText = await response.text();
            console.log("Registration response:", responseText);

            let result;

           try {
    result = JSON.parse(responseText);
} catch (error) {
    console.error("PHP returned:", responseText);

    throw new Error(
        "PHP ERROR: " + responseText.substring(0, 500)
    );
}

            if (!response.ok || !result.success) {
                showMessage(result.message || "Registration failed.");
                return;
            }

            showMessage("Registration successful! Redirecting to login...", "green");

            signupForm.reset();

            if (phoneError) phoneError.textContent = "";
            if (confirmPasswordError) confirmPasswordError.textContent = "";

            if (passwordRequirements) {
                passwordRequirements.style.display = "none";
            }

            setTimeout(function() {
                window.location.href = "index.html";
            }, 2000);

        } catch (error) {
            console.error("Registration error:", error);
            showMessage(error.message || "Unable to connect to the server.");
        }
    });
}



// ==================================================
// RESIDENCE HOMEPAGE
// ==================================================

function goToRequest() {
    window.location.href = "request.html";
}

function goToTracking() {
    window.location.href = "tracking.html";
}

function showNotifications() {
    window.location.href = "notifications.html";
}


// ==================================================
// DOCUMENT REQUEST AND ATTACHMENTS
// ==================================================

const documentRequestForm =
    document.getElementById("documentRequestForm");

const documentType = document.getElementById("documentType");

const attachmentInput =
    document.getElementById("attachments");

const attachmentSection =
    document.getElementById("requiredAttachmentSection");

const attachmentInstruction =
    document.getElementById("attachmentInstruction");

const attachmentList =
    document.getElementById("attachmentList");

const attachmentError =
    document.getElementById("attachmentError");

let selectedFiles = [];

const requiredDocuments = {
    "Barangay Indigency": "Any Valid ID",
    "Barangay Clearance": "Any Valid ID",
    "Certificate of Residency": "Any Valid ID",
    "Business Clearance": "Business Permit",
    "Community Tax Certificate (CTC/Cedula)": "Order of Heir Apparent"
};

const allowedExtensions = [
    "jpg", "jpeg", "png", "pdf", "doc", "docx"
];

const maximumFileSize = 5 * 1024 * 1024;

// DISPLAY REQUIRED ATTACHMENT
if (documentType) {
    documentType.addEventListener("change", function () {
        selectedFiles = [];

        if (attachmentInput) attachmentInput.value = "";
        if (attachmentList) attachmentList.innerHTML = "";
        if (attachmentError) attachmentError.textContent = "";

        const required = requiredDocuments[this.value];

        if (required) {
            if (attachmentSection) {
                attachmentSection.hidden = false;
            }

            if (attachmentInstruction) {
                attachmentInstruction.textContent =
                    "Required attachment: " + required;
            }
        } else {
            if (attachmentSection) {
                attachmentSection.hidden = true;
            }
        }
    });
}

// DISPLAY AND REMOVE ATTACHMENTS
if (attachmentInput) {
    attachmentInput.addEventListener("change", function () {
        const newFiles = Array.from(this.files);

        if (attachmentError) attachmentError.textContent = "";

        newFiles.forEach(function (file) {
            const extension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                if (attachmentError) {
                    attachmentError.textContent =
                        "Invalid file format: " + file.name;
                }
                return;
            }

            if (file.size > maximumFileSize) {
                if (attachmentError) {
                    attachmentError.textContent =
                        file.name + " exceeds the 5 MB file size limit.";
                }
                return;
            }

            const alreadyAdded = selectedFiles.some(function (existingFile) {
                return existingFile.name === file.name &&
                    existingFile.size === file.size;
            });

            if (!alreadyAdded) {
                selectedFiles.push(file);
            }
        });

        updateAttachmentList();
        attachmentInput.value = "";
    });

    function updateAttachmentList() {
        if (!attachmentList) return;

        attachmentList.innerHTML = "";

        selectedFiles.forEach(function (file, index) {
            const item = document.createElement("div");
            const fileName = document.createElement("span");

            fileName.textContent =
                file.name + " (" +
                (file.size / 1024 / 1024).toFixed(2) + " MB)";

            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function () {
                selectedFiles.splice(index, 1);
                updateAttachmentList();
            });

            item.appendChild(fileName);
            item.appendChild(removeButton);

            attachmentList.appendChild(item);
        });
    }
}


// ==================================================
// ADMIN REQUEST MANAGEMENT - FEATURE 7
// ==================================================

const ADMIN_REQUESTS_KEY = "residenceAdminRequests";

/*const defaultAdminRequests = [
    {
        reference: "RES-001",
        name: "Juan Dela Cruz",
        email: "juan@email.com",
        phone: "09123456789",
        document: "Barangay Clearance",
        purpose: "Employment requirements",
        /*urgency: "ASAP",*/
    //    date: "November 7, 2026",
      //  status: "Pending",
        rejectionReason: ""
  //  }, /*
   // {
     /*   reference: "RES-002",
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "09987654321",
        document: "Certificate of Residency",
        purpose: "School requirements",
        /*urgency: "Later",*/
        //date: "November 8, 2026",
      //  status: "Approved",
    //    rejectionReason: ""
  //  }
//]; 


// GET ALL ADMIN REQUESTS
function getAdminRequests() {
    try {
        const savedRequests =
            localStorage.getItem(ADMIN_REQUESTS_KEY);

        if (savedRequests === null) {
            localStorage.setItem(
                ADMIN_REQUESTS_KEY,
                JSON.stringify(defaultAdminRequests)
            );

            return defaultAdminRequests;
        }

        const requests = JSON.parse(savedRequests);

        return Array.isArray(requests) ? requests : [];
    } catch (error) {
        return [];
    }
}

// SAVE ALL ADMIN REQUESTS
function saveAdminRequests(requests) {
    localStorage.setItem(
        ADMIN_REQUESTS_KEY,
        JSON.stringify(requests)
    );
}

// FIND REQUEST USING REFERENCE NUMBER
function findAdminRequest(reference) {
    const requests = getAdminRequests();

    return requests.find(function (request) {
        return request.reference === reference;
    });
}

// GET STATUS CSS CLASS
function getAdminStatusClass(status) {
    const classes = {
        Pending: "pending",
        Approved: "approved",
        Rejected: "rejected",
        Processing: "processing",
        Completed: "completed"
    };

    return classes[status] || "pending";
}


// ==================================================
// FEATURE 8 - REQUEST STATUS MANAGEMENT
// ==================================================

// UPDATE A REQUEST'S STATUS
function updateRequestStatus(reference) {
    const select = document.getElementById("statusSelect" + reference);

    if (!select) return;
}

// ==================================================
// UPDATE REQUEST STATUS IN MYSQL
// ==================================================

async function updateRequestStatusInDatabase(
    reference,
    status,
    rejectionReason = ""
) {
    try {
        const response = await fetch("update_request_status.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reference: reference,
                status: status,
                rejectionReason: rejectionReason
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Unable to update request.");
            return false;
        }

        return true;

    } catch (error) {
        console.error("Database update error:", error);
        alert("Unable to connect to the database.");
        return false;
    }
}


// ==================================================
// SAVE REQUEST STATUS
// ==================================================

async function saveRequestStatus(reference) {
    const requests = getAdminRequests();

    const request = requests.find(function (item) {
        return item.reference === reference;
    });

    if (!request) {
        alert("Request not found.");
        return;
    }

    const select = document.getElementById("statusSelect" + reference);

    if (!select) return;

    const newStatus = select.value;

    let rejectionReason = "";

    if (newStatus === "Rejected") {
        rejectionReason = prompt(
            "Please enter the reason for rejecting this request:"
        );

        if (!rejectionReason || !rejectionReason.trim()) {
            alert("A rejection reason is required.");
            select.value = request.status;
            return;
        }

        rejectionReason = rejectionReason.trim();
    }

    if (request.status === newStatus) {
        alert("The request already has this status.");
        return;
    }

    const oldStatus = request.status;

    const success = await updateRequestStatusInDatabase(
        reference,
        newStatus,
        rejectionReason
    );

    if (!success) {
        select.value = oldStatus;
        return;
    }

    request.status = newStatus;
    request.rejectionReason = rejectionReason;
    request.updatedAt = new Date().toISOString();

    saveAdminRequests(requests);

    addResidentNotification(
        "Request Status Updated",
        "Your " + request.document +
        " request (" + reference + ") changed from " +
        oldStatus + " to " + newStatus + ".",
        reference,
        newStatus === "Rejected" ? "❌" : "📄"
    );

    displayAdminRequests();

    alert("Request status successfully updated to " + newStatus + "!");
}


// ==================================================
// APPROVE AN INDIVIDUAL REQUEST
// ==================================================

async function approveRequestByReference(reference) {
    const requests = getAdminRequests();

    const request = requests.find(function (item) {
        return item.reference === reference;
    });

    if (!request) {
        alert("Request not found.");
        return;
    }

    if (request.status !== "Pending") {
        alert("Only pending requests can be approved.");
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to approve request " + reference + "?"
    );

    if (!confirmation) return;

    const success = await updateRequestStatusInDatabase(
        reference,
        "Approved",
        ""
    );

    if (!success) return;

    request.status = "Approved";
    request.rejectionReason = "";
    request.updatedAt = new Date().toISOString();

    saveAdminRequests(requests);

    addResidentNotification(
        "Request Approved",
        "Your " + request.document +
        " request has been approved.",
        reference,
        "✅"
    );

    displayAdminRequests();

    alert("Request " + reference + " has been approved!");
}


// ==================================================
// REJECT AN INDIVIDUAL REQUEST
// ==================================================

async function rejectRequestByReference(reference) {
    const requests = getAdminRequests();

    const request = requests.find(function (item) {
        return item.reference === reference;
    });

    if (!request) {
        alert("Request not found.");
        return;
    }

    if (request.status !== "Pending") {
        alert("Only pending requests can be rejected.");
        return;
    }

    const reason = prompt(
        "Please enter the reason for rejecting request " + reference + ":"
    );

    if (!reason || !reason.trim()) {
        alert("A rejection reason is required.");
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to reject request " + reference + "?"
    );

    if (!confirmation) return;

    const rejectionReason = reason.trim();

    const success = await updateRequestStatusInDatabase(
        reference,
        "Rejected",
        rejectionReason
    );

    if (!success) return;

    request.status = "Rejected";
    request.rejectionReason = rejectionReason;
    request.updatedAt = new Date().toISOString();

    saveAdminRequests(requests);

    addResidentNotification(
        "Request Rejected",
        "Your " + request.document +
        " request was rejected. Reason: " + rejectionReason,
        reference,
        "❌"
    );

    displayAdminRequests();

    alert("Request " + reference + " has been rejected.");
}



// ==================================================
// RESIDENT NOTIFICATION SYSTEM - MYSQL DATABASE
// ==================================================
// RESIDENT NOTIFICATION PAGINATION
let residentNotifications = [];
let currentNotificationPage = 1;
const notificationsPerPage = 5;

// LOAD NOTIFICATIONS FROM MYSQL
async function displayResidentNotifications(preservePage = false) {

    const list = document.getElementById("residentNotificationsList");

    if (!list) return;

    list.innerHTML = "<p>Loading notifications...</p>";

    try {

        const response = await fetch("get_resident_notifications.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to load notifications."
            );
        }

      residentNotifications = result.notifications || [];

if (!preservePage) {
    currentNotificationPage = 1;
}

const notifications = residentNotifications;

const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / notificationsPerPage)
);

if (currentNotificationPage > totalPages) {
    currentNotificationPage = totalPages;
}

list.innerHTML = "";

        if (notifications.length === 0) {

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "You don't have any notifications yet.";
            emptyMessage.id = "emptyResidentNotifications";

            list.appendChild(emptyMessage);
            const pagination = document.getElementById(
    "residentNotificationPagination"
);

if (pagination) {
    pagination.hidden = true;
}
            return;
        }

        const startIndex =
    (currentNotificationPage - 1) * notificationsPerPage;

const endIndex = startIndex + notificationsPerPage;

const visibleNotifications = notifications.slice(startIndex, endIndex);

visibleNotifications.forEach(function (notification) {

            const item = document.createElement("div");

            item.className = "resident-notification";
            item.setAttribute("role", "button");
            item.setAttribute("tabindex", "0");

            if (!notification.is_read) {
                item.classList.add("unread");
            }

            const icon = document.createElement("div");
            icon.className = "resident-notification-icon";
            icon.textContent = "📄";

            const content = document.createElement("div");
            content.className = "resident-notification-content";

            const title = document.createElement("strong");
            title.textContent = notification.title;

            const message = document.createElement("p");
            message.textContent = notification.message;

            const date = document.createElement("span");

            const notificationDate = notification.created_at
                ? new Date(notification.created_at.replace(" ", "T"))
                : null;

            date.textContent = notificationDate &&
                !isNaN(notificationDate.getTime())
                ? notificationDate.toLocaleString("en-PH", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })
                : "";

            content.appendChild(title);
            content.appendChild(message);
            content.appendChild(date);

            item.appendChild(icon);
            item.appendChild(content);

            if (!notification.is_read) {

                const dot = document.createElement("span");
                dot.className = "resident-unread-dot";

                item.appendChild(dot);
            }

            // CLICK NOTIFICATION
            async function openNotification() {

                try {

                    // Prevent repeated clicks while processing
                    item.style.pointerEvents = "none";

                    if (!notification.is_read) {

                        const readResponse = await fetch(
                            "mark_resident_notification_read.php",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: "same-origin",
                                body: JSON.stringify({
                                    notification_id: notification.id
                                })
                            }
                        );

                        const readResult = await readResponse.json();

                        if (!readResponse.ok || !readResult.success) {
                            throw new Error(
                                readResult.message ||
                                "Unable to mark notification as read."
                            );
                        }

                        notification.is_read = true;

                        item.classList.remove("unread");

                        const unreadDot = item.querySelector(
                            ".resident-unread-dot"
                        );

                        if (unreadDot) {
                            unreadDot.remove();
                        }

                        await loadResidentNotificationCount();
                    }

                    // Open the related request in Tracking
                    if (notification.request_id) {

                        window.location.href =
                            "tracking.html?request_id=" +
                            encodeURIComponent(notification.request_id);

                    } else {

                        // Older notifications may not have a request ID
                        window.location.href = "tracking.html";
                    }

                } catch (error) {

                    console.error("Notification click error:", error);

                    item.style.pointerEvents = "auto";

                    alert("Unable to open this notification. Please try again.");
                }
            }

            item.addEventListener("click", openNotification);

            item.addEventListener("keydown", function (event) {

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openNotification();
                }

            });

            list.appendChild(item);

        });updateResidentNotificationPagination();

    } catch (error) {

        console.error("Resident notification error:", error);

        list.innerHTML =
            "<p>Unable to load notifications. Please try again.</p>";
    }
}
// UPDATE RESIDENT NOTIFICATION PAGINATION
function updateResidentNotificationPagination() {

    const pagination = document.getElementById(
        "residentNotificationPagination"
    );

    const previousButton = document.getElementById(
        "previousNotificationPage"
    );

    const nextButton = document.getElementById(
        "nextNotificationPage"
    );

    const pageInfo = document.getElementById(
        "notificationPageInfo"
    );

    if (!pagination || !previousButton || !nextButton || !pageInfo) {
        return;
    }

    const totalPages = Math.ceil(
        residentNotifications.length / notificationsPerPage
    );

    pagination.hidden = totalPages <= 1;

    pageInfo.textContent =
        "Page " + currentNotificationPage + " of " + totalPages;

    previousButton.disabled = currentNotificationPage === 1;

    nextButton.disabled = currentNotificationPage === totalPages;
}



// MARK ALL RESIDENT NOTIFICATIONS AS READ


window.markResidentNotificationsRead = async function () {

    try {

        const response = await fetch(
            "mark_resident_notifications_read.php",
            {
                method: "POST",
                credentials: "same-origin"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to update notifications."
            );
        }

        // Refresh the notification list
        await displayResidentNotifications();

        // Refresh the notification badge
        await loadResidentNotificationCount();

        
    } catch (error) {

        console.error("Mark notifications as read error:", error);

        alert("Unable to mark notifications as read.");

    }
};

// TEMPORARY COMPATIBILITY FOR EXISTING REQUEST SUBMISSION CODE
// Actual notification creation will be handled by submit_request.php.
function addResidentNotification() {
    displayResidentNotifications();
}


// LOAD NOTIFICATIONS WHEN THE NOTIFICATIONS PAGE OPENS
displayResidentNotifications();
loadResidentNotificationCount();


// ==================================================
// DOCUMENT REQUEST SUBMISSION
// ==================================================

if (documentRequestForm) {
    documentRequestForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const selectedDocument = documentType
            ? documentType.value
            : "";

        const purposeElement =
            document.getElementById("requestPurpose");

        const purpose = purposeElement
            ? purposeElement.value.trim()
            : "";

        if (!selectedDocument) {
            alert("Please select a document.");
            return;
        }

        if (!purpose) {
            alert("Please enter the purpose of your request.");
            return;
        }

        if (!requiredDocuments[selectedDocument]) {
            alert("Please select a valid document type.");
            return;
        }

        if (selectedFiles.length === 0) {
            if (attachmentError) {
                attachmentError.textContent =
                    "Please upload the required attachment.";
            }

            alert("Attachment is required for this document.");
            return;
        }

        const residentProfile = await getResidentProfile();

        const name = residentProfile.name;
        const email = residentProfile.email;
        const phone = residentProfile.phone;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("document", selectedDocument);
        formData.append("purpose", purpose);
     //   formData.append("urgency", "Later");

        selectedFiles.forEach(function (file) {
            formData.append("attachments[]", file);
        });

        try {
            const response = await fetch("submit_request.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                alert(
                    result.message ||
                    "Your request could not be submitted."
                );
                return;
            }

            const reference = result.reference;

            const requests = getAdminRequests();

            const newRequest = {
                reference: reference,
                name: name,
                email: email,
                phone: phone,
                document: selectedDocument,
                purpose: purpose,
                /*urgency: "Later",*/
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
                submittedAt: new Date().toISOString(),
                status: "Pending",
                rejectionReason: "",
                attachments: selectedFiles.map(function (file) {
                    return file.name;
                })
            };

            requests.unshift(newRequest);
            saveAdminRequests(requests);

            addResidentNotification(
                "Request Submitted",
                "Your " + selectedDocument +
                " request was successfully submitted.",
                reference,
                "📄"
            );

            alert(
                "Your request was successfully submitted!\n\n" +
                "Reference Number: " + reference + "\n" +
                "Document: " + selectedDocument +
                "\n\nYour request status is Pending."
            );

            documentRequestForm.reset();

            selectedFiles = [];

            if (attachmentList) {
                attachmentList.innerHTML = "";
            }

            if (attachmentSection) {
                attachmentSection.hidden = true;
            }

            if (attachmentError) {
                attachmentError.textContent = "";
            }

        } catch (error) {
            console.error("Request submission error:", error);

            alert(
                "Unable to connect to the server. " +
                "Please check that Apache and MySQL are running."
            );
        }
    });
}


// ==================================================
// RESIDENT PROFILE
// ==================================================

// ==================================================
// RESIDENT PROFILE - MYSQL DATABASE
// ==================================================

let currentResidentProfile = null;

// GET THE LOGGED-IN RESIDENT'S PROFILE FROM MYSQL
async function getResidentProfile() {

    if (currentResidentProfile) {
        return currentResidentProfile;
    }

    const response = await fetch("get_resident_profile.php", {
        method: "GET",
        credentials: "same-origin"
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Unable to load resident profile."
        );
    }

    currentResidentProfile = result.resident;

    return currentResidentProfile;
}


// DISPLAY THE ACTUAL RESIDENT'S INFORMATION
async function displayResidentProfile() {

    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");
    const displayPhone = document.getElementById("displayPhone");
    const profileName = document.getElementById("profileName");
    const residentName = document.getElementById("residentName");
    const avatar = document.querySelector(".profile-avatar");

    // Do not fetch the profile on pages that do not display it
    if (
        !displayName &&
        !displayEmail &&
        !displayPhone &&
        !profileName &&
        !residentName &&
        !avatar
    ) {
        return;
    }

    try {

        const profile = await getResidentProfile();

        if (displayName) displayName.textContent = profile.name;
        if (displayEmail) displayEmail.textContent = profile.email;
        if (displayPhone) displayPhone.textContent = profile.phone;
        if (profileName) profileName.textContent = profile.name;
        if (residentName) residentName.textContent = profile.name;

        if (avatar) {
            avatar.textContent = profile.name
                .split(" ")
                .filter(word => word.length > 0)
                .map(word => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
        }

    } catch (error) {

        console.error("Resident profile loading error:", error);

        if (residentName) {
            residentName.textContent = "Unable to load profile";
        }

        if (displayName) {
            displayName.textContent = "Unable to load profile";
        }
    }
}


// LOAD PROFILE WHEN A RESIDENT PAGE OPENS
displayResidentProfile();


// EDIT PROFILE SECTION
async function toggleEditProfile() {

    const section = document.getElementById("editProfileSection");

    if (!section) return;

    const isHidden = section.hidden;
    section.hidden = !isHidden;

    if (isHidden) {

        try {

            const profile = await getResidentProfile();

            document.getElementById("editName").value = profile.name;
            document.getElementById("editEmail").value = profile.email;
            document.getElementById("editPhone").value = profile.phone;

        } catch (error) {

            alert(error.message);
        }
    }
}

const profileForm = document.getElementById("profileForm");

if (profileForm) {
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("editName").value.trim();
        const email = document.getElementById("editEmail").value.trim();
        const phone = document.getElementById("editPhone").value.trim();

        try {
            const response = await fetch("update_resident_profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to save profile changes."
                );
            }

            currentResidentProfile = result.resident;

            const displayName = document.getElementById("displayName");
            const displayEmail = document.getElementById("displayEmail");
            const displayPhone = document.getElementById("displayPhone");
            const profileName = document.getElementById("profileName");
            const avatar = document.querySelector(".profile-avatar");

            if (displayName) displayName.textContent = result.resident.name;
            if (displayEmail) displayEmail.textContent = result.resident.email;
            if (displayPhone) displayPhone.textContent = result.resident.phone;
            if (profileName) profileName.textContent = result.resident.name;

            if (avatar) {
                avatar.textContent = result.resident.name
                    .split(" ")
                    .filter(word => word.length > 0)
                    .map(word => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
            }

            document.getElementById("editProfileSection").hidden = true;
            alert("Profile changes saved successfully.");
        } catch (error) {
            console.error("Save resident profile error:", error);
            alert(error.message || "Unable to save profile changes.");
        }
    });
}


async function logoutResident() {

    const confirmLogout = confirm("Are you sure you want to log out?");

    if (!confirmLogout) {
        return;
    }

    try {

        const response = await fetch("logout.php", {
            method: "POST",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to log out."
            );
        }

        

        // Return to the login page
        window.location.href = "index.html";

   } catch (error) {

    console.error("Logout error:", error);

    alert("Logout Error: " + error.message);

}
}



// ==================================================
// ADMIN DASHBOARD
// ==================================================

function adminLogout() {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
        window.location.href = "admin_logout.php";
    }
}


// ==================================================
// ADMIN STAFF REGISTRATION
// ==================================================



const adminSignupForm = document.getElementById("adminSignupForm");

if (adminSignupForm) {
    const staffPhone = document.getElementById("staffPhone");
    const staffPassword = document.getElementById("staffPassword");
    const staffConfirmPassword =
        document.getElementById("staffConfirmPassword");

    if (staffPhone) {
        staffPhone.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 11);
        });
    }

    adminSignupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName =
            document.getElementById("staffFirstName").value.trim();

        const middleName =
            document.getElementById("staffMiddleName").value.trim();

        const lastName =
            document.getElementById("staffLastName").value.trim();

        const staffPosition =
            document.getElementById("staffPosition").value;

        const staffEmail =
            document.getElementById("staffEmail").value.trim();

        const phoneNumber = staffPhone.value;
        const passwordValue = staffPassword.value;
        const confirmValue = staffConfirmPassword.value;

        const agreement = document.getElementById("staffAgreement");

        if (!firstName || !lastName || !staffPosition ||
            !staffEmail || !phoneNumber || !passwordValue ||
            !confirmValue) {
            alert("Please complete all required fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!/^09[0-9]{9}$/.test(phoneNumber)) {
            alert("Invalid phone number. Enter exactly 11 digits starting with 09.");
            return;
        }

        if (passwordValue.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        if (passwordValue !== confirmValue) {
            alert("Passwords do not match!");
            return;
        }

        if (!agreement || !agreement.checked) {
            alert("Please confirm that your information is correct.");
            return;
        }

        const formData = new FormData();

        formData.append("first_name", firstName);
        formData.append("middle_name", middleName);
        formData.append("last_name", lastName);
        formData.append("position", staffPosition);
        formData.append("email", staffEmail);
        formData.append("phone", phoneNumber);
        formData.append("password", passwordValue);

        const submitButton = adminSignupForm.querySelector(
            'button[type="submit"]'
        );

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "SUBMITTING...";
            }

            const response = await fetch("admin_register.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Registration failed.");
            }

            alert(result.message);

            adminSignupForm.reset();

        } catch (error) {
            console.error("Staff registration error:", error);
            alert(error.message || "Unable to submit registration.");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "SUBMIT REGISTRATION";
            }
        }
    });
}

// ==================================================
// ADMIN REQUEST LIST - MYSQL DATABASE
// ==================================================

let adminRequests = [];
let currentAdminRequestPage = 1;
const adminRequestsPerPage = 5;

async function displayAdminRequests() {
    const list = document.getElementById("adminRequestList");

    if (!list) return;

    const emptyMessage = document.getElementById("noAdminRequests");

    list.innerHTML = "<p>Loading requests...</p>";

    try {
        const response = await fetch("get_requests.php");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load requests.");
        }

        adminRequests = result.requests.map(function (item) {
            return {
                id: item.id,
                reference: item.reference,
                name: item.name,
                document: item.document,
                purpose: item.purpose || "",
                /*urgency: item.urgency || "Normal",*/
                status: item.status,
                rejectionReason: item.rejection_reason || "",
                date: item.created_at,
                submittedAt: item.created_at,
                email: item.email,
                phone: item.phone || "",
                attachments: Array.isArray(item.attachments)
                    ? item.attachments
                    : []
            };
        });

        saveAdminRequests(adminRequests);

        const totalPages = Math.max(
            1,
            Math.ceil(adminRequests.length / adminRequestsPerPage)
        );
        currentAdminRequestPage = Math.min(
            currentAdminRequestPage,
            totalPages
        );

        list.innerHTML = "";

        if (adminRequests.length === 0) {
            if (emptyMessage) {
                emptyMessage.hidden = false;
            }

            updateAdminRequestPagination();
            return;
        }

        if (emptyMessage) {
            emptyMessage.hidden = true;
        }

        const startIndex =
            (currentAdminRequestPage - 1) * adminRequestsPerPage;
        const visibleRequests = adminRequests.slice(
            startIndex,
            startIndex + adminRequestsPerPage
        );

        visibleRequests.forEach(function (request) {
            const card = document.createElement("div");
            card.className = "manage-request-card";

            const heading = document.createElement("div");
            heading.className = "manage-request-heading";

            const information = document.createElement("div");

            const reference = document.createElement("span");
            reference.className = "request-number";
            reference.textContent = request.reference;

            const documentName = document.createElement("h3");
            documentName.textContent = request.document;

            const detailsLink = document.createElement("a");
            detailsLink.className = "view-details-btn";
            detailsLink.href =
                "admin-request-details.php?id=" +
                encodeURIComponent(request.reference);
            detailsLink.textContent = "View Details";

            information.appendChild(reference);
            information.appendChild(documentName);
            information.appendChild(detailsLink);

            const status = document.createElement("span");
            status.id = "status" + request.reference;
            status.className =
                "status " + getAdminStatusClass(request.status);
            status.textContent = request.status;

            heading.appendChild(information);
            heading.appendChild(status);

            const resident = document.createElement("p");
            resident.textContent = "Resident: " + request.name;

            const purpose = document.createElement("p");
            purpose.textContent = "Purpose: " + request.purpose;

            /*const urgency = document.createElement("p");
            urgency.textContent = "Urgency: " + request.urgency;*/

            // Display uploaded attachments
const attachmentSection = document.createElement("div");
attachmentSection.className = "admin-attachments";

const attachmentTitle = document.createElement("h4");
attachmentTitle.textContent = "Uploaded Attachments";

attachmentSection.appendChild(attachmentTitle);

if (request.attachments.length > 0) {

    request.attachments.forEach(function (file) {

        // Only allow filenames generated by submit_request.php
        if (!/^[a-f0-9]{32}\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(file.stored_name || "")) {
            return;
        }

        const fileName = file.original_name || "View attachment";
        const fileUrl =
            "uploads/" + encodeURIComponent(file.stored_name);
        const fileLink = document.createElement("a");

        fileLink.href = fileUrl;
        fileLink.className = "view-details-btn";
        fileLink.textContent = fileName;
        fileLink.addEventListener("click", function (event) {
            event.preventDefault();
            openAttachmentPreview(fileUrl, fileName, file.stored_name);
        });

        attachmentSection.appendChild(fileLink);
    });

} else {

    const noFiles = document.createElement("p");
    noFiles.textContent = "No attachments uploaded.";
    attachmentSection.appendChild(noFiles);

}

            const label = document.createElement("label");
            label.setAttribute(
                "for",
                "statusSelect" + request.reference
            );
            label.textContent = "Update Request Status";

            const select = document.createElement("select");
            select.id = "statusSelect" + request.reference;

            const availableStatuses = [
                "Pending",
                "Approved",
                "Processing",
                "Completed",
                "Rejected"
            ];

            availableStatuses.forEach(function (statusValue) {
                const option = document.createElement("option");

                option.value = statusValue;
                option.textContent = statusValue;

                if (request.status === statusValue) {
                    option.selected = true;
                }

                select.appendChild(option);
            });

            select.addEventListener("change", function () {
                updateRequestStatus(request.reference);
            });

            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.className = "admin-update-button";
            saveButton.textContent = "SAVE STATUS";

            saveButton.addEventListener("click", function () {
                saveRequestStatus(request.reference);
            });

            const approveButton = document.createElement("button");
            approveButton.type = "button";
            approveButton.className = "admin-update-button";
            approveButton.textContent = "APPROVE";

            approveButton.addEventListener("click", function () {
                approveRequestByReference(request.reference);
            });

            const rejectButton = document.createElement("button");
            rejectButton.type = "button";
            rejectButton.className = "admin-update-button";
            rejectButton.textContent = "REJECT";

            rejectButton.addEventListener("click", function () {
                rejectRequestByReference(request.reference);
            });

            if (request.status !== "Pending") {
                approveButton.disabled = true;
                rejectButton.disabled = true;
            }

            card.appendChild(heading);
card.appendChild(resident);
card.appendChild(purpose);
/*card.appendChild(urgency);*/
card.appendChild(attachmentSection);
card.appendChild(label);
card.appendChild(select);

const actionButtons = document.createElement("div");
actionButtons.className = "request-action-buttons";

actionButtons.appendChild(saveButton);
actionButtons.appendChild(approveButton);
actionButtons.appendChild(rejectButton);

card.appendChild(actionButtons);

            list.appendChild(card);
        });

        updateAdminRequestPagination();
    } catch (error) {
        console.error("Admin request loading error:", error);

        adminRequests = [];
        updateAdminRequestPagination();
        list.innerHTML =
            "<p>Unable to load requests. Please check your server connection.</p>";
    }
}

function updateAdminRequestPagination() {
    const pagination = document.getElementById("adminRequestPagination");
    const previousButton = document.getElementById("previousAdminRequestPage");
    const nextButton = document.getElementById("nextAdminRequestPage");
    const pageInfo = document.getElementById("adminRequestPageInfo");

    if (!pagination || !previousButton || !nextButton || !pageInfo) {
        return;
    }

    const totalPages = Math.max(
        1,
        Math.ceil(adminRequests.length / adminRequestsPerPage)
    );

    pagination.hidden = totalPages <= 1;
    pageInfo.textContent =
        "Page " + currentAdminRequestPage + " of " + totalPages;
    previousButton.disabled = currentAdminRequestPage === 1;
    nextButton.disabled = currentAdminRequestPage === totalPages;
}


// ==================================================
// TRACKING REQUESTS - MYSQL DATABASE
// ==================================================

async function displayTrackingRequests() {
    const tableBody = document.getElementById("requestTableBody");

    if (!tableBody) return;

    const totalRequests = document.getElementById("totalRequests");
    const requestCount = document.getElementById("requestCount");
    const noRequestsMessage = document.getElementById("noRequestsMessage");

    tableBody.innerHTML = "<tr><td colspan='5'>Loading your requests...</td></tr>";

    try {
        const residentProfile = await getResidentProfile();

        const residentEmail = (residentProfile.email || "")
            .trim()
            .toLowerCase();

        const response = await fetch("get_requests.php");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load requests.");
        }

        const requests = result.requests.filter(function (request) {
            return (request.email || "").trim().toLowerCase() === residentEmail;
        });

        tableBody.innerHTML = "";

        if (totalRequests) {
            totalRequests.textContent = requests.length;
        }

        if (requestCount) {
            requestCount.textContent = "Showing " + requests.length + " requests";
        }

        if (noRequestsMessage) {
            noRequestsMessage.hidden = requests.length !== 0;
        }

        requests.forEach(function (request) {
            const dateObject = request.created_at
                ? new Date(request.created_at.replace(" ", "T"))
                : null;

            const validDate =
                dateObject && !isNaN(dateObject.getTime());

            const displayDate = validDate
                ? dateObject.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : "Date unavailable";

            const sortableDate = validDate
                ? dateObject.toISOString().split("T")[0]
                : "";

            const currentStatus = request.status || "Pending";

            const requestRow = document.createElement("tr");

            requestRow.className = "request-row";
            requestRow.dataset.id = request.id || "";
            requestRow.dataset.reference = request.reference || "";
            requestRow.dataset.document = request.document || "";
            requestRow.dataset.date = sortableDate;
            requestRow.dataset.status = currentStatus;

            const referenceCell = document.createElement("td");
            referenceCell.dataset.label = "Reference No.";
            referenceCell.textContent = request.reference || "N/A";
            requestRow.appendChild(referenceCell);

            const documentCell = document.createElement("td");
            documentCell.dataset.label = "Document Type";
            documentCell.textContent = request.document || "N/A";
            requestRow.appendChild(documentCell);

            const dateCell = document.createElement("td");
            dateCell.dataset.label = "Date Submitted";
            dateCell.textContent = displayDate;
            requestRow.appendChild(dateCell);

            const statusCell = document.createElement("td");
            statusCell.dataset.label = "Status";

            const statusElement = document.createElement("span");
            statusElement.className =
                "status " + getAdminStatusClass(currentStatus);
            statusElement.textContent = currentStatus;

            statusCell.appendChild(statusElement);
            requestRow.appendChild(statusCell);

            const detailsRow = document.createElement("tr");
            detailsRow.className = "details-row";
            detailsRow.hidden = true;

            const detailsCell = document.createElement("td");
            detailsCell.colSpan = 5;

            const details = document.createElement("div");
            details.className = "request-details";

            const heading = document.createElement("h4");
            heading.textContent = "Request Details - " + request.reference;
            details.appendChild(heading);

            function addDetail(label, value) {
                const paragraph = document.createElement("p");

                const strong = document.createElement("strong");
                strong.textContent = label + ": ";

                paragraph.appendChild(strong);
                paragraph.appendChild(
                    document.createTextNode(value || "Not provided")
                );

                details.appendChild(paragraph);
            }

            addDetail("Document", request.document);
            addDetail("Purpose", request.purpose);
            addDetail("Date Submitted", displayDate);
            addDetail("Current Status", currentStatus);
        //    addDetail("Urgency", request.urgency);

           
const timeline = document.createElement("div");
timeline.className = "detail-timeline";

const submittedStage = document.createElement("p");
submittedStage.textContent = "✓ Submitted - " + displayDate;
timeline.appendChild(submittedStage);

if (currentStatus === "Rejected") {

    const rejectedStage = document.createElement("p");
    rejectedStage.textContent = "✕ Rejected";
    rejectedStage.className = "rejected";
    timeline.appendChild(rejectedStage);

    if (request.rejection_reason) {
        addDetail("Rejection Reason", request.rejection_reason);
    }

} else {

    const stages = [
        "Approved",
        "Processing",
        "Completed"
    ];

    const statusOrder = {
        Pending: 0,
        Approved: 1,
        Processing: 2,
        Completed: 3
    };

    const currentStage = statusOrder[currentStatus] ?? 0;

    stages.forEach(function (stage, index) {

        const item = document.createElement("p");
        const stageNumber = index + 1;

        if (stageNumber < currentStage) {
            item.textContent = "✓ " + stage;
        } else if (stageNumber === currentStage) {
            item.textContent = "✓ " + stage;
            item.className = "current-stage";
        } else {
            item.textContent = "○ " + stage;
        }

        timeline.appendChild(item);
    });
}

details.appendChild(timeline);

if (currentStatus === "Completed") {
    const message = document.createElement("div");
    message.className = "tracking-message completed-message";
    message.textContent = "Your document is ready for release.";
    details.appendChild(message);
}

if (currentStatus === "Rejected") {
    const message = document.createElement("div");
    message.className = "tracking-message";
    message.textContent =
        "Your request was rejected. Please review the rejection reason.";
    details.appendChild(message);
}

detailsCell.appendChild(details);
detailsRow.appendChild(detailsCell);

const actionCell = document.createElement("td");
actionCell.dataset.label = "Action";

const viewButton = document.createElement("button");
viewButton.type = "button";
viewButton.className = "view-request";
viewButton.textContent = "View Details";

actionCell.appendChild(viewButton);
requestRow.appendChild(actionCell);

tableBody.appendChild(requestRow);
tableBody.appendChild(detailsRow);

});

window.dispatchEvent(new Event("trackingRequestsLoaded"));

// OPEN THE REQUEST FROM A NOTIFICATION

} catch (error) {

    console.error("Tracking loading error:", error);

    tableBody.innerHTML =
        "<tr><td colspan='5'>Unable to load your requests. Please check your server connection.</td></tr>";

    if (totalRequests) {
        totalRequests.textContent = "0";
    }

    if (requestCount) {
        requestCount.textContent = "Showing 0 requests";
    }
}

}

displayTrackingRequests();

// ==================================================
// INITIALIZE ADMIN REQUEST PAGES
// ==================================================

// INITIALIZE ADMIN REQUEST PAGES

displayAdminRequests();


// ==================================================
// ADMIN LOGIN
// ==================================================

const adminLoginForm = document.getElementById("adminLoginForm");
const adminPassword = document.getElementById("adminPassword");
const adminTogglePassword = document.getElementById("adminTogglePassword");
const adminForgotPassword = document.getElementById("adminForgotPassword");

if (adminTogglePassword && adminPassword) {
    adminTogglePassword.addEventListener("click", function () {
        if (adminPassword.type === "password") {
            adminPassword.type = "text";
            adminTogglePassword.textContent = "Hide";
        } else {
            adminPassword.type = "password";
            adminTogglePassword.textContent = "Show";
        }
    });
}


if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const passwordValue = adminPassword
            ? adminPassword.value
            : "";

        const error = document.getElementById("adminLoginError");

        if (error) error.textContent = "";

        if (!email || !passwordValue) {
            if (error) {
                error.textContent = "Please enter your email and password.";
            }
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (error) {
                error.textContent = "Please enter a valid email address.";
            }
            return;
        }

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", passwordValue);

            const response = await fetch("admin_login.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                if (error) {
                    error.textContent = result.message ||
                        "Invalid email or password.";
                }
                return;
            }

            window.location.href = "admin.php";

        } catch (err) {
            console.error("Admin login error:", err);

            if (error) {
                error.textContent =
                    "Unable to connect to the server. Please try again.";
            }
        }
    });
}

if (adminForgotPassword) {
    adminForgotPassword.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Staff password recovery will be available soon.");
    });
}


// ==================================================
// ADMIN NOTIFICATIONS
// ==================================================

function markAllRead() {
    const notifications = document.querySelectorAll(
        ".admin-notification.unread"
    );

    notifications.forEach(function (notification) {
        notification.classList.remove("unread");

        const dot = notification.querySelector(".unread-dot");

        if (dot) dot.remove();
    });

    alert("All notifications marked as read!");
}


// ==================================================
// INITIALIZE RESIDENT NOTIFICATIONS
// ==================================================

displayResidentNotifications();


// ==================================================
// INITIALIZE RESIDENT TRACKING - FEATURE 8
// ==================================================

displayTrackingRequests();


// ==================================================
// REQUEST HISTORY: SEARCH, FILTER, SORT, PAGINATION
// ==================================================

(function () {
    const tableBody = document.getElementById("requestTableBody");

    if (!tableBody) return;

    const searchInput = document.getElementById("requestSearch");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter = document.getElementById("dateFilter");
    const requestCount = document.getElementById("requestCount");
    const noRequestsMessage = document.getElementById("noRequestsMessage");
    const resetButton = document.getElementById("resetFilters");
    const sortButtons = document.querySelectorAll(".sort-button");

    const requestsPerPage = 5;

    let currentPage = 1;
    let sortColumn = "date";
    let sortDirection = "desc";

    let documentFilter = document.getElementById("documentFilter");

    const historyControls = document.querySelector(".history-controls");

    if (!documentFilter && historyControls) {
        const filterContainer = document.createElement("div");
        filterContainer.className = "history-filter";

        const filterLabel = document.createElement("label");
        filterLabel.setAttribute("for", "documentFilter");
        filterLabel.textContent = "Filter by Document";

        documentFilter = document.createElement("select");
        documentFilter.id = "documentFilter";

        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Documents";

        documentFilter.appendChild(allOption);

        const documentTypes = [
            ...new Set(
                Array.from(tableBody.querySelectorAll(".request-row"))
                    .map(row => row.dataset.document)
                    .filter(Boolean)
            )
        ];

        documentTypes.forEach(function (type) {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            documentFilter.appendChild(option);
        });

        filterContainer.appendChild(filterLabel);
        filterContainer.appendChild(documentFilter);

        historyControls.appendChild(filterContainer);
    }

    // REFRESH DOCUMENT FILTER OPTIONS AFTER MYSQL LOADS
    function refreshDocumentFilterOptions() {
        if (!documentFilter) return;

        const selectedValue = documentFilter.value;

        documentFilter.innerHTML = "";

        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Documents";
        documentFilter.appendChild(allOption);

        const documentTypes = [
            ...new Set(
                Array.from(tableBody.querySelectorAll(".request-row"))
                    .map(row => row.dataset.document)
                    .filter(Boolean)
            )
        ];

        documentTypes.forEach(function (type) {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            documentFilter.appendChild(option);
        });

        if (
            Array.from(documentFilter.options)
                .some(option => option.value === selectedValue)
        ) {
            documentFilter.value = selectedValue;
        }
    }

    // CREATE PAGINATION CONTROLS
    let pagination = document.getElementById("requestPagination");

    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "requestPagination";
        pagination.className = "request-pagination";

        const tableWrapper =
            document.querySelector(".request-table-wrapper");

        if (tableWrapper) {
            tableWrapper.insertAdjacentElement("afterend", pagination);
        } else {
            tableBody.insertAdjacentElement("afterend", pagination);
        }
    }

    // GET REQUEST AND DETAILS ROWS
    function getRequestPairs() {
        const rows = Array.from(
            tableBody.querySelectorAll(".request-row")
        );

        return rows.map(function (row) {
            return {
                request: row,
                details: row.nextElementSibling
            };
        });
    }

    // SORT REQUESTS
    function sortRequests(pairs) {
        pairs.sort(function (a, b) {
            let valueA = "";
            let valueB = "";

            if (sortColumn === "reference") {
                valueA = a.request.dataset.reference || "";
                valueB = b.request.dataset.reference || "";
            } else if (sortColumn === "document") {
                valueA = a.request.dataset.document || "";
                valueB = b.request.dataset.document || "";
            } else {
                valueA = a.request.dataset.date || "";
                valueB = b.request.dataset.date || "";
            }

            const comparison = valueA.localeCompare(valueB);

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });

        pairs.forEach(function (pair) {
            tableBody.appendChild(pair.request);

            if (pair.details) {
                tableBody.appendChild(pair.details);
            }
        });

        return pairs;
    }

    // UPDATE SORT INDICATORS
    function updateSortIndicators() {
        sortButtons.forEach(function (button) {
            const column = button.dataset.sort;

            const originalText = button.textContent
                .replace(/[↑↓↕]/g, "")
                .trim();

            if (column === sortColumn) {
                button.textContent =
                    originalText + (sortDirection === "asc" ? " ↑" : " ↓");
            } else {
                button.textContent = originalText + " ↕";
            }
        });
    }

    // DISPLAY PAGINATION
    function updatePagination(totalPages) {
        pagination.innerHTML = "";

        if (totalPages <= 1) return;

        const previousButton = document.createElement("button");
        previousButton.type = "button";
        previousButton.textContent = "Previous";
        previousButton.disabled = currentPage === 1;

        previousButton.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                applyFilters();
            }
        });

        const pageLabel = document.createElement("span");
        pageLabel.textContent =
            "Page " + currentPage + " of " + totalPages;

        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.textContent = "Next";
        nextButton.disabled = currentPage === totalPages;

        nextButton.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                applyFilters();
            }
        });

        pagination.appendChild(previousButton);
        pagination.appendChild(pageLabel);
        pagination.appendChild(nextButton);
    }

    // APPLY SEARCH AND FILTERS
    function applyFilters() {
        const pairs = getRequestPairs();

        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value
            : "all";

        const selectedDocument = documentFilter
            ? documentFilter.value
            : "all";

        sortRequests(pairs);

        const filteredPairs = pairs.filter(function (pair) {
            const row = pair.request;

            const reference =
                (row.dataset.reference || "").toLowerCase();

            const documentName =
                (row.dataset.document || "").toLowerCase();

            const status = row.dataset.status || "";

            const matchesSearch =
                reference.includes(searchText) ||
                documentName.includes(searchText);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            const matchesDocument =
                selectedDocument === "all" ||
                row.dataset.document === selectedDocument;

            return matchesSearch && matchesStatus && matchesDocument;
        });

        const totalRequests = filteredPairs.length;

        const totalPages = Math.ceil(totalRequests / requestsPerPage);

        if (totalPages === 0) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * requestsPerPage;
        const endIndex = startIndex + requestsPerPage;

        const visiblePairs = filteredPairs.slice(startIndex, endIndex);

        pairs.forEach(function (pair) {
            pair.request.hidden = true;

            if (pair.details) {
                pair.details.hidden = true;
            }
        });

        visiblePairs.forEach(function (pair) {
            pair.request.hidden = false;
        });

        if (requestCount) {
            if (totalRequests === 0) {
                requestCount.textContent = "Showing 0 requests";
            } else {
                const firstRequest = startIndex + 1;
                const lastRequest = Math.min(endIndex, totalRequests);

                requestCount.textContent =
                    "Showing " + firstRequest +
                    "–" + lastRequest + " of " + totalRequests + " requests";
            }
        }

        if (noRequestsMessage) {
            noRequestsMessage.hidden = totalRequests !== 0;
        }

        updatePagination(totalPages);
        updateSortIndicators();
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            currentPage = 1;
            applyFilters();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", function () {
            currentPage = 1;
            applyFilters();
        });
    }

    if (documentFilter) {
        documentFilter.addEventListener("change", function () {
            currentPage = 1;
            applyFilters();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener("change", function () {
            sortColumn = "date";
            sortDirection =
                dateFilter.value === "newest" ? "desc" : "asc";

            currentPage = 1;
            applyFilters();
        });
    }

    sortButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const column = button.dataset.sort;

            if (!column) return;

            if (sortColumn === column) {
                sortDirection =
                    sortDirection === "asc" ? "desc" : "asc";
            } else {
                sortColumn = column;
                sortDirection = "asc";
            }

            if (column === "date" && dateFilter) {
                dateFilter.value =
                    sortDirection === "desc" ? "newest" : "oldest";
            }

            currentPage = 1;
            applyFilters();
        });
    });

    // VIEW OR HIDE REQUEST DETAILS
    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest(
            ".view-request, .view-details"
        );

        if (!button) return;

        const row = button.closest(".request-row");

        if (!row) return;

        const detailsRow = row.nextElementSibling;

        if (
            !detailsRow ||
            !detailsRow.classList.contains("details-row")
        ) {
            return;
        }

        const isOpening = detailsRow.hidden;

        getRequestPairs().forEach(function (pair) {
            if (pair.details) {
                pair.details.hidden = true;
            }

            const otherButton =
                pair.request.querySelector(".view-request, .view-details");

            if (otherButton) {
                otherButton.textContent = "View Details";
            }
        });

        if (isOpening) {
            detailsRow.hidden = false;
            button.textContent = "Hide Details";
        }
    });

    // RESET ALL FILTERS AND SORTING
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (statusFilter) statusFilter.value = "all";
            if (documentFilter) documentFilter.value = "all";
            if (dateFilter) dateFilter.value = "newest";

            sortColumn = "date";
            sortDirection = "desc";
            currentPage = 1;

            getRequestPairs().forEach(function (pair) {
                if (pair.details) {
                    pair.details.hidden = true;
                }

                const button =
                    pair.request.querySelector(".view-request, .view-details");

                if (button) {
                    button.textContent = "View Details";
                }
            });

            applyFilters();
        });
    }

   
// REFRESH FILTERS WHEN MYSQL REQUESTS FINISH LOADING
window.addEventListener("trackingRequestsLoaded", function () {
    refreshDocumentFilterOptions();
    currentPage = 1;
    applyFilters();

    // OPEN THE REQUEST FROM A NOTIFICATION
    const urlParams = new URLSearchParams(window.location.search);
    const targetRequestId = urlParams.get("request_id");

    if (targetRequestId) {

        // Clear filters so the selected request can be found
        if (searchInput) searchInput.value = "";
        if (statusFilter) statusFilter.value = "all";
        if (documentFilter) documentFilter.value = "all";

        const pairs = getRequestPairs();

        // Arrange requests using the current sorting order
        sortRequests(pairs);

        const targetIndex = pairs.findIndex(function (pair) {
            return pair.request.dataset.id === targetRequestId;
        });

        if (targetIndex !== -1) {

            // Go to the page containing the selected request
            currentPage = Math.floor(targetIndex / requestsPerPage) + 1;

            applyFilters();

            // Find and open the selected request
            const targetPair = getRequestPairs().find(function (pair) {
                return pair.request.dataset.id === targetRequestId;
            });

            if (targetPair) {
                const viewButton = targetPair.request.querySelector(
                    ".view-request, .view-details"
                );

                if (viewButton) {
                    viewButton.click();

                    targetPair.request.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        }
    }
});

    // INITIAL DISPLAY
    applyFilters();

})();


// ==================================================
// ADMIN DASHBOARD - MYSQL DATABASE
// ==================================================

async function displayAdminDashboard() {

    const recentList = document.getElementById(
        "dashboardRecentRequests"
    );

    const noRequests = document.getElementById(
        "dashboardNoRequests"
    );

    try {
        const response = await fetch("get_requests.php");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to retrieve requests."
            );
        }

        const requests = result.requests.map(function (item) {
            return {
                id: item.id,
                reference: item.reference,
                name: item.name,
                email: item.email,
                document: item.document,
                purpose: item.purpose,
                /*urgency: item.urgency,*/
                status: item.status || "Pending",
                rejectionReason: item.rejection_reason || "",
                date: item.created_at,
                submittedAt: item.created_at
            };
        });

        const total = requests.length;

        const pending = requests.filter(function (request) {
            return request.status === "Pending";
        }).length;

        const approved = requests.filter(function (request) {
            return request.status === "Approved";
        }).length;

        const processing = requests.filter(function (request) {
            return request.status === "Processing";
        }).length;

        const rejected = requests.filter(function (request) {
            return request.status === "Rejected";
        }).length;

        const completed = requests.filter(function (request) {
            return request.status === "Completed";
        }).length;

        const statistics = {
            totalRequests: total,
            pendingRequests: pending,
            approvedRequests: approved,
            processingRequests: processing,
            rejectedRequests: rejected,
            completedRequests: completed
        };

        Object.keys(statistics).forEach(function (id) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = statistics[id];
            }
        });

        if (!recentList) return;

        recentList.innerHTML = "";

        if (requests.length === 0) {
            if (noRequests) {
                noRequests.hidden = false;
            }
            return;
        }

        if (noRequests) {
            noRequests.hidden = true;
        }

        const recentRequests = requests.slice(0, 3);

        recentRequests.forEach(function (request) {

            const card = document.createElement("div");
            card.className = "admin-request-card";

            const information = document.createElement("div");

            const reference = document.createElement("span");
            reference.className = "request-number";
            reference.textContent = request.reference;

            const documentName = document.createElement("h3");
            documentName.textContent = request.document;

            const resident = document.createElement("p");
            resident.textContent =
                "Resident: " + (request.name || "Resident");

            /*const urgency = document.createElement("p");
            urgency.textContent =
                "Urgency: " + (request.urgency || "Not specified");*/

            information.appendChild(reference);
            information.appendChild(documentName);
            information.appendChild(resident);
            /*information.appendChild(urgency);*/

            const status = document.createElement("span");
            status.className =
                "status " + getAdminStatusClass(request.status);

            status.textContent = request.status;

            card.appendChild(information);
            card.appendChild(status);

            recentList.appendChild(card);
        });

    } catch (error) {

        console.error("Admin dashboard loading error:", error);

        if (recentList) {
            recentList.innerHTML =
                "<p>Unable to load dashboard requests. Please check your server connection.</p>";
        }
    }
}


// INITIALIZE DASHBOARD
if (document.getElementById("dashboardRecentRequests")) {
    displayAdminDashboard();
}


// ==================================================
// ADMIN REPORTS - MYSQL DATABASE
// ==================================================

async function displayAdminReports() {

    const tableBody = document.getElementById("reportDocumentSummary");

    try {
        const response = await fetch("get_requests.php");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to retrieve report data."
            );
        }

        const requests = result.requests;

        const total = requests.length;

        const pending = requests.filter(r => r.status === "Pending").length;
        const approved = requests.filter(r => r.status === "Approved").length;
        const processing = requests.filter(r => r.status === "Processing").length;
        const completed = requests.filter(r => r.status === "Completed").length;
        const rejected = requests.filter(r => r.status === "Rejected").length;

        const reportStats = {
            reportTotal: total,
            reportApproved: approved,
            reportRejected: rejected,
            reportCompleted: completed
        };

        Object.keys(reportStats).forEach(function(id) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = reportStats[id];
            }
        });

        const statusData = [
            { name: "Pending", count: pending, text: "reportPendingText", bar: "reportPendingBar" },
            { name: "Approved", count: approved, text: "reportApprovedText", bar: "reportApprovedBar" },
            { name: "Processing", count: processing, text: "reportProcessingText", bar: "reportProcessingBar" },
            { name: "Completed", count: completed, text: "reportCompletedText", bar: "reportCompletedBar" },
            { name: "Rejected", count: rejected, text: "reportRejectedText", bar: "reportRejectedBar" }
        ];

        statusData.forEach(function(status) {

            const percentage = total > 0
                ? (status.count / total) * 100
                : 0;

            const textElement = document.getElementById(status.text);
            const barElement = document.getElementById(status.bar);

            if (textElement) {
                textElement.textContent =
                    status.count + " (" + percentage.toFixed(1) + "%)";
            }

            if (barElement) {
                barElement.style.width = percentage + "%";
            }
        });

        const documentSummary = {};

        requests.forEach(function(request) {

            const documentName = request.document || "Other Document";

            if (!documentSummary[documentName]) {
                documentSummary[documentName] = {
                    total: 0,
                    completed: 0
                };
            }

            documentSummary[documentName].total++;

            if (request.status === "Completed") {
                documentSummary[documentName].completed++;
            }
        });

        if (tableBody) {

            tableBody.innerHTML = "";

            const documentTypes = Object.keys(documentSummary);

            if (documentTypes.length === 0) {

                const row = document.createElement("tr");
                const cell = document.createElement("td");

                cell.colSpan = 3;
                cell.textContent = "No document requests available.";

                row.appendChild(cell);
                tableBody.appendChild(row);

            } else {

                documentTypes.forEach(function(documentName) {

                    const data = documentSummary[documentName];

                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = documentName;

                    const totalCell = document.createElement("td");
                    totalCell.textContent = data.total;

                    const completedCell = document.createElement("td");
                    completedCell.textContent = data.completed;

                    row.appendChild(nameCell);
                    row.appendChild(totalCell);
                    row.appendChild(completedCell);

                    tableBody.appendChild(row);
                });
            }
        }

    } catch (error) {

        console.error("Admin reports loading error:", error);

        if (tableBody) {
            tableBody.innerHTML = "";

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 3;
            cell.textContent = "Unable to load report data. Please check your server connection.";

            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    }
}


// RUN ONLY ON THE ADMIN REPORTS PAGE
if (document.getElementById("reportDocumentSummary")) {
    displayAdminReports();
}
// ==========================================
// ATTACHMENT PREVIEW FUNCTIONS
// ==========================================

function openAttachmentPreview(url, fileName, storedName) {

    const modal = document.getElementById("attachmentPreviewModal");
    const previewBody = document.getElementById("attachmentPreviewBody");
    const previewTitle = document.getElementById("attachmentPreviewTitle");
    const downloadButton = document.getElementById("downloadAttachment");

    if (!modal || !previewBody || !previewTitle || !downloadButton) {
        alert("Attachment preview is unavailable.");
        return;
    }

    const extension = storedName.split(".").pop().toLowerCase();

    previewTitle.textContent = fileName;
    previewBody.innerHTML = "";

    downloadButton.href = url;
    downloadButton.setAttribute("download", fileName);

    if (["jpg", "jpeg", "png"].includes(extension)) {

        const image = document.createElement("img");

        image.src = url;
        image.alt = fileName;

        previewBody.appendChild(image);

    } else if (extension === "pdf") {

        const pdf = document.createElement("iframe");

        pdf.src = url;
        pdf.title = fileName;

        previewBody.appendChild(pdf);

    } else {

        const message = document.createElement("p");

        message.textContent =
            "Preview is not available for this file type. " +
            "Please download the attachment to view it.";

        previewBody.appendChild(message);
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
}


// CLOSE ATTACHMENT PREVIEW
function closeAttachmentPreview() {

    const modal = document.getElementById("attachmentPreviewModal");
    const previewBody = document.getElementById("attachmentPreviewBody");

    if (!modal) return;

    modal.hidden = true;

    if (previewBody) {
        previewBody.innerHTML = "";
    }

    document.body.style.overflow = "";
}


// CLOSE BUTTON
const closeAttachmentButton =
    document.getElementById("closeAttachmentPreview");

if (closeAttachmentButton) {
    closeAttachmentButton.addEventListener("click", function () {
        closeAttachmentPreview();
    });
}


// CLOSE WHEN CLICKING OUTSIDE THE PREVIEW
const attachmentModal =
    document.getElementById("attachmentPreviewModal");

if (attachmentModal) {
    attachmentModal.addEventListener("click", function (event) {

        if (event.target === attachmentModal) {
            closeAttachmentPreview();
        }

    });
}


// CLOSE USING ESCAPE KEY
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeAttachmentPreview();
    }

});

// ==========================================
// ADMIN REQUEST DETAILS
// ==========================================

let currentAdminRequest = null;

// Load the selected request from the database
async function displayAdminRequestDetails() {

    const reference = new URLSearchParams(window.location.search).get("id");

    if (!reference) {
        alert("Request reference not found.");
        return;
    }

    try {
        const response = await fetch("get_requests.php");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load request.");
        }

        currentAdminRequest = result.requests.find(function (request) {
            return request.reference === reference;
        });

        if (!currentAdminRequest) {
            alert("Request not found.");
            return;
        }

        const request = currentAdminRequest;

        document.getElementById("detailReference").textContent = request.reference;
        document.getElementById("detailDocument").textContent = request.document;
        document.getElementById("detailName").textContent = request.name;
        document.getElementById("detailEmail").textContent = request.email;
        document.getElementById("detailPhone").textContent = request.phone || "Not provided";
        document.getElementById("detailRequestNumber").textContent = request.reference;

        document.getElementById("detailDocumentInfo").textContent = request.document;
        /*document.getElementById("detailUrgency").textContent = request.urgency || "Normal";*/
        document.getElementById("detailDate").textContent = request.created_at;
        document.getElementById("detailCurrentStatus").textContent = request.status;
        document.getElementById("detailPurpose").textContent = request.purpose || "Not provided";

        const statusElement = document.getElementById("requestStatus");
        statusElement.textContent = request.status;
        statusElement.className = "status " + request.status.toLowerCase();

        // Display uploaded attachments
        const attachmentContainer = document.getElementById("detailAttachments");
        attachmentContainer.innerHTML = "";

        const attachments = Array.isArray(request.attachments)
            ? request.attachments
            : [];

        if (attachments.length === 0) {
            attachmentContainer.textContent = "No attachments uploaded.";
        } else {

            attachments.forEach(function (file) {

                if (!/^[a-f0-9]{32}\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(file.stored_name || "")) {
                    return;
                }

               const link = document.createElement("a");

link.href = "uploads/" + encodeURIComponent(file.stored_name);
link.textContent = file.original_name || "View attachment";

link.addEventListener("click", function (event) {
    event.preventDefault();

    openAttachmentPreview(
        link.href,
        file.original_name || "Resident Attachment",
        file.stored_name
    );
});

attachmentContainer.appendChild(link);
attachmentContainer.appendChild(document.createElement("br"));
            });
        }

        // Display rejection reason if available
        const rejectionSection = document.getElementById("savedRejectionSection");
        const rejectionText = document.getElementById("detailRejectionReason");

        if (request.rejection_reason) {
            rejectionSection.hidden = false;
            rejectionText.textContent = request.rejection_reason;
        } else {
            rejectionSection.hidden = true;
        }

        // Disable decisions if the request is no longer pending
        const isPending = request.status === "Pending";

        document.getElementById("approveRequestButton").disabled = !isPending;
        document.getElementById("showRejectButton").disabled = !isPending;

    } catch (error) {
        console.error("Request details error:", error);
        alert("Unable to load request details.");
    }
}


// ==========================================
// APPROVE REQUEST
// ==========================================

async function approveDatabaseRequest() {

    if (!currentAdminRequest) {
        alert("Request information is not loaded.");
        return;
    }

    if (currentAdminRequest.status !== "Pending") {
        alert("Only pending requests can be approved.");
        return;
    }

    const confirmed = confirm("Are you sure you want to approve this request?");

    if (!confirmed) return;

    const success = await updateRequestStatusInDatabase(
        currentAdminRequest.reference,
        "Approved"
    );

    if (success) {
        alert("Request approved successfully!");
        await displayAdminRequestDetails();
    }
}


// ==========================================
// SHOW REJECTION FORM
// ==========================================

function showDatabaseRejectForm() {

    if (!currentAdminRequest || currentAdminRequest.status !== "Pending") {
        alert("Only pending requests can be rejected.");
        return;
    }

    document.getElementById("rejectForm").hidden = false;
}


// ==========================================
// REJECT REQUEST
// ==========================================

async function rejectDatabaseRequest() {

    if (!currentAdminRequest) {
        alert("Request information is not loaded.");
        return;
    }

    const reason = document.getElementById("rejectionReason").value.trim();

    if (reason === "") {
        alert("Please provide a reason for rejecting this request.");
        return;
    }

    if (currentAdminRequest.status !== "Pending") {
        alert("Only pending requests can be rejected.");
        return;
    }

    const confirmed = confirm("Are you sure you want to reject this request?");

    if (!confirmed) return;

    const success = await updateRequestStatusInDatabase(
        currentAdminRequest.reference,
        "Rejected",
        reason
    );

    if (success) {
        alert("Request rejected successfully!");
        await displayAdminRequestDetails();
    }
}


// ==========================================
// INITIALIZE ADMIN REQUEST DETAILS PAGE
// ==========================================

if (document.getElementById("detailReference")) {
    displayAdminRequestDetails();
}


// ==================================================
// ADMIN NOTIFICATION SYSTEM - MYSQL DATABASE
// ==================================================
// ADMIN NOTIFICATION PAGINATION
let adminNotifications = [];
let currentAdminNotificationPage = 1;
const adminNotificationsPerPage = 5;

async function displayAdminNotifications() {
    const list = document.getElementById("adminNotificationsList");

    if (!list) return;

    list.innerHTML = "<p>Loading notifications...</p>";

    try {
        const response = await fetch("get_admin_notifications.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load notifications.");
        }
adminNotifications = result.notifications || [];

const notifications = adminNotifications;

const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / adminNotificationsPerPage)
);

if (currentAdminNotificationPage > totalPages) {
    currentAdminNotificationPage = totalPages;
}

console.log("Admin notifications received:", notifications);
        list.innerHTML = "";

        if (notifications.length === 0) {
            list.innerHTML = "<p>You don't have any notifications yet.</p>";
            return;
        }

        const startIndex =
    (currentAdminNotificationPage - 1) * adminNotificationsPerPage;

const endIndex = startIndex + adminNotificationsPerPage;

const visibleNotifications = notifications.slice(startIndex, endIndex);

visibleNotifications.forEach(function (notification) {
            const item = document.createElement("div");
            item.className = "admin-notification";

            if (Number(notification.is_read) === 0) {
                item.classList.add("unread");
            }

            // Make the notification clickable
            item.style.cursor = "pointer";

            const icon = document.createElement("div");
            icon.className = "notification-icon";
            icon.textContent = "📄";

            const content = document.createElement("div");
            content.className = "notification-content";

            const title = document.createElement("strong");
            title.textContent = notification.title;

            const message = document.createElement("p");
            message.textContent = notification.message;

            const date = document.createElement("span");

            if (notification.created_at) {
                const notificationDate = new Date(
                    notification.created_at.replace(" ", "T")
                );

                date.textContent = !isNaN(notificationDate.getTime())
                    ? notificationDate.toLocaleString("en-PH", {
                        dateStyle: "medium",
                        timeStyle: "short"
                    })
                    : "";
            }

            content.appendChild(title);
            content.appendChild(message);
            content.appendChild(date);

            item.appendChild(icon);
            item.appendChild(content);

            if (Number(notification.is_read) === 0) {
                const dot = document.createElement("span");
                dot.className = "unread-dot";
                item.appendChild(dot);
            }

            // Open the related request when clicked
            item.addEventListener("click", async function () {
                const reference = notification.reference;

                if (!reference) {
                    alert("The related document request could not be found.");
                    return;
                }

                try {
                    const readResponse = await fetch(
                        "mark_admin_notification_read.php",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "same-origin",
                            body: JSON.stringify({
                                notification_id: notification.id
                            })
                        }
                    );

                    const readResult = await readResponse.json();

                    if (!readResponse.ok || !readResult.success) {
                        throw new Error("Unable to mark notification as read.");
                    }

                    window.location.href =
                        "admin-request-details.php?id=" +
                        encodeURIComponent(reference);

                } catch (error) {
                    console.error(error);
                    alert("Unable to open the notification. Please try again.");
                }
            });

            list.appendChild(item);
        });
        updateAdminNotificationPagination();
    } catch (error) {
        console.error("Admin notification error:", error);
        list.innerHTML =
            "<p>Unable to load notifications. Please try again.</p>";
    }
}



// ==================================================
// MARK ALL ADMIN NOTIFICATIONS AS READ
// ==================================================

window.markAllRead = async function () {
    try {
        const response = await fetch("mark_admin_notifications_read.php", {
            method: "POST",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to update notifications.");
        }

        await displayAdminNotifications();
        await loadAdminNotificationCount();

    } catch (error) {
        console.error("Mark notifications as read error:", error);
        alert("Unable to mark notifications as read.");
    }
};

// ==================================================
// UPDATE ADMIN NOTIFICATION PAGINATION
// ==================================================

function updateAdminNotificationPagination() {

    const pagination = document.getElementById(
        "adminNotificationPagination"
    );

    const previousButton = document.getElementById(
        "previousAdminNotification"
    );

    const nextButton = document.getElementById(
        "nextAdminNotification"
    );

    const pageInfo = document.getElementById(
        "adminNotificationPageInfo"
    );

    if (!pagination || !previousButton || !nextButton || !pageInfo) {
        return;
    }

    const totalPages = Math.ceil(
        adminNotifications.length / adminNotificationsPerPage
    );

    pagination.hidden = totalPages <= 1;

    pageInfo.textContent =
        "Page " + currentAdminNotificationPage + " of " + totalPages;

    previousButton.disabled = currentAdminNotificationPage === 1;

    nextButton.disabled =
        currentAdminNotificationPage === totalPages;
}
// ==================================================
// ADMIN NOTIFICATION BELL COUNT
// ==================================================

async function loadAdminNotificationCount() {
    const badge = document.getElementById("adminNotificationBadge");

    if (!badge) return;

    try {
        const response = await fetch("get_admin_notifications.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Unable to load notification count.");
        }

        const notifications = result.notifications || [];

        const unreadCount = notifications.filter(function (notification) {
            return Number(notification.is_read) === 0;
        }).length;

        badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
        badge.hidden = unreadCount === 0;

    } catch (error) {
        console.error("Admin notification count error:", error);
    }
}


// ==================================================
// LOAD ADMIN NOTIFICATIONS
// ==================================================

displayAdminNotifications();
loadAdminNotificationCount();


// ==================================================
// RESIDENT HOME - RECENT REQUESTS FROM MYSQL
// ==================================================

async function displayHomeRecentRequests() {

    const container = document.getElementById(
        "recentRequestsContainer"
    );

    // Only run on the resident home page
    if (!container) return;

    container.innerHTML = "<p>Loading your recent requests...</p>";

    try {

        // Get the logged-in resident's profile
        const residentProfile = await getResidentProfile();

        const residentEmail = (residentProfile.email || "")
            .trim()
            .toLowerCase();

        // Retrieve requests from MySQL
        const response = await fetch("get_requests.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to load recent requests."
            );
        }

        // Only show requests belonging to this resident
        const requests = result.requests.filter(function (request) {

            return (request.email || "")
                .trim()
                .toLowerCase() === residentEmail;

        });

        // Sort requests from newest to oldest
        requests.sort(function (a, b) {

            return new Date(b.created_at) -
                   new Date(a.created_at);

        });

        // Display only the latest 3 requests
        const recentRequests = requests.slice(0, 3);

        container.innerHTML = "";

        if (recentRequests.length === 0) {

            container.innerHTML =
                "<p>You have no recent requests yet.</p>";

            return;
        }

        recentRequests.forEach(function (request) {

            const card = document.createElement("div");
            card.className = "request-card";

            const top = document.createElement("div");
            top.className = "request-top";

            const heading = document.createElement("h3");
            heading.textContent = request.document || "Document Request";

            const status = document.createElement("span");

            const currentStatus = request.status || "Pending";

            status.className =
                "status " + getAdminStatusClass(currentStatus);

            status.textContent = currentStatus;

            top.appendChild(heading);
            top.appendChild(status);

            const reference = document.createElement("p");
            reference.textContent =
                "Request #" + (request.reference || "N/A");

            card.appendChild(top);
            card.appendChild(reference);

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Recent requests loading error:", error);

        container.innerHTML =
            "<p>Unable to load your recent requests.</p>";

    }
}

// LOAD RECENT REQUESTS ON THE HOME PAGE
displayHomeRecentRequests();


// ==================================================
// LOAD RESIDENT NOTIFICATION COUNT
// ==================================================

async function loadResidentNotificationCount() {

    const badge = document.getElementById("residentNotificationBadge");

    // Stop if the notification badge does not exist on this page
    if (!badge) return;

    try {

        const response = await fetch("get_resident_notifications.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to load notification count."
            );
        }

        const notifications = result.notifications || [];

        const unreadCount = notifications.filter(function (notification) {
            return !notification.is_read;
        }).length;

        badge.textContent = unreadCount > 99 ? "99+" : unreadCount;

        badge.hidden = unreadCount === 0;

    } catch (error) {

        console.error("Resident notification count error:", error);

    }
}


// ==================================================
// STAFF REGISTRATION MANAGEMENT
// ==================================================

let allStaffRegistrations = [];
let activeStaffTab = "Pending";
let showAllStaff = false;

// LOAD STAFF REGISTRATIONS
async function displayPendingStaff() {
    const staffList = document.getElementById("staffApprovalList");
    const noStaffMessage = document.getElementById("noStaffApprovals");

    if (!staffList) return;

    staffList.innerHTML = "<p>Loading staff registrations...</p>";

    try {
        const response = await fetch("get_pending_staff.php", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load staff registrations.");
        }

        allStaffRegistrations = result.staff || [];

        updateStaffCounts();
        renderStaffTab();

    } catch (error) {
        console.error("Staff loading error:", error);

        staffList.innerHTML =
            "<p>Unable to load staff registration requests.</p>";

        if (noStaffMessage) {
            noStaffMessage.hidden = true;
        }
    }
}

// UPDATE TAB COUNTS
function updateStaffCounts() {
    const pendingCount = document.getElementById("pendingStaffCount");
    const approvedCount = document.getElementById("approvedStaffCount");
    const rejectedCount = document.getElementById("rejectedStaffCount");

    if (pendingCount) {
        pendingCount.textContent =
            allStaffRegistrations.filter(staff => staff.status === "Pending").length;
    }

    if (approvedCount) {
        approvedCount.textContent =
            allStaffRegistrations.filter(staff => staff.status === "Approved").length;
    }

    if (rejectedCount) {
        rejectedCount.textContent =
            allStaffRegistrations.filter(staff => staff.status === "Rejected").length;
    }
}

// DISPLAY SELECTED TAB

function renderStaffTab() {
    const staffList = document.getElementById("staffApprovalList");
    const noStaffMessage = document.getElementById("noStaffApprovals");

    if (!staffList) return;

    staffList.innerHTML = "";

    const searchInput = document.getElementById("staffSearchInput");
const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

const filteredStaff = allStaffRegistrations.filter(staff => {
    const matchesTab = staff.status === activeStaffTab;

    const fullName = [
        staff.first_name,
        staff.middle_name,
        staff.last_name
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesSearch =
        fullName.includes(searchTerm) ||
        (staff.email || "").toLowerCase().includes(searchTerm) ||
        (staff.position || "").toLowerCase().includes(searchTerm);

    return matchesTab && matchesSearch;
});

    if (noStaffMessage) {
        noStaffMessage.hidden = filteredStaff.length !== 0;
    }

    if (filteredStaff.length === 0) {
        return;
    }

    // Always show only the 3 most recent staff members on the dashboard
const visibleStaff = filteredStaff.slice(0, 3);

    visibleStaff.forEach(staff => {
        const card = document.createElement("div");
        card.className = "staff-approval-card";

        const fullName = [
            staff.first_name,
            staff.middle_name,
            staff.last_name
        ].filter(Boolean).join(" ");

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = fullName;

        const position = document.createElement("p");
        position.textContent = "Position: " + staff.position;

        const email = document.createElement("p");
        email.textContent = "Email: " + staff.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + staff.phone;

        const date = document.createElement("p");
        date.textContent = "Registered: " + staff.created_at;

        const status = document.createElement("span");
        status.className = "staff-status-badge " + staff.status.toLowerCase();
        status.textContent = staff.status;

        details.append(name, position, status);
        // VIEW STAFF DETAILS BUTTON
const viewDetailsButton = document.createElement("button");
viewDetailsButton.type = "button";
viewDetailsButton.textContent = "View Details";
viewDetailsButton.className = "view-staff-details-button";

viewDetailsButton.addEventListener("click", function () {
    openStaffDetails(staff);
});

details.appendChild(viewDetailsButton);
        card.appendChild(details);

        if (staff.status === "Pending") {
            const actions = document.createElement("div");
            actions.className = "staff-approval-actions";

            const approveButton = document.createElement("button");
            approveButton.type = "button";
            approveButton.textContent = "Approve";
            approveButton.className = "approve-staff-button";

            approveButton.addEventListener("click", function () {
                updateStaffStatus(staff.id, "Approved");
            });

            const rejectButton = document.createElement("button");
            rejectButton.type = "button";
            rejectButton.textContent = "Reject";
            rejectButton.className = "reject-staff-button";

            rejectButton.addEventListener("click", function () {
                updateStaffStatus(staff.id, "Rejected");
            });

            actions.append(approveButton, rejectButton);
            card.appendChild(actions);
        }

        staffList.appendChild(card);
    });

    // Add View All / Show Less button when necessary
    if (filteredStaff.length > 3) {
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "staff-view-all-button";

        toggleButton.textContent =
    "View All Staff (" + filteredStaff.length + ")";

toggleButton.addEventListener("click", function () {
    openStaffDirectory(filteredStaff);
});

        staffList.appendChild(toggleButton);
    }
}


// SWITCH TABS
document.addEventListener("DOMContentLoaded", function () {
    // SEARCH STAFF
const staffSearchInput = document.getElementById("staffSearchInput");

if (staffSearchInput) {
    staffSearchInput.addEventListener("input", function () {
        showAllStaff = false;
        renderStaffTab();
    });
}
    const tabs = document.querySelectorAll(".staff-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(item => item.classList.remove("active"));

           this.classList.add("active");
activeStaffTab = this.dataset.status;

// Reset to showing only 3 staff members
showAllStaff = false;

renderStaffTab();
        });
    });

    displayPendingStaff();
});


// ==================================================
// APPROVE OR REJECT STAFF
// ==================================================

async function updateStaffStatus(staffId, status) {
    const action = status === "Approved" ? "approve" : "reject";

    if (!confirm("Are you sure you want to " + action + " this staff registration?")) {
        return;
    }

    const formData = new FormData();
    formData.append("staff_id", staffId);
    formData.append("status", status);

    try {
        const response = await fetch("update_staff_status.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            await displayPendingStaff();
        }

    } catch (error) {
        console.error("Staff status update error:", error);
        alert("Unable to update staff registration.");
    }
}


// ==================================================
// STAFF DETAILS MODAL
// ==================================================

function openStaffDetails(staff) {
    const fullName = [
        staff.first_name,
        staff.middle_name,
        staff.last_name
    ].filter(Boolean).join(" ");

    document.getElementById("detailStaffName").textContent = fullName;
    document.getElementById("detailStaffPosition").textContent = staff.position || "Not provided";
    document.getElementById("detailStaffEmail").textContent = staff.email || "Not provided";
    document.getElementById("detailStaffPhone").textContent = staff.phone || "Not provided";
    document.getElementById("detailStaffDate").textContent = staff.created_at || "Not available";
    document.getElementById("detailStaffStatus").textContent = staff.status || "Unknown";

    document.getElementById("staffDetailsModal").hidden = false;
}


// ==================================================
// STAFF DIRECTORY MODAL
// ==================================================

function openStaffDirectory(staffMembers) {
    const modal = document.getElementById("staffDirectoryModal");
    const directoryList = document.getElementById("staffDirectoryList");
    const directoryTitle = document.getElementById("staffDirectoryTitle");

    if (!modal || !directoryList) return;

    directoryTitle.textContent =
        activeStaffTab + " Staff (" + staffMembers.length + ")";

    directoryList.innerHTML = "";

    staffMembers.forEach(staff => {
        const card = document.createElement("div");
        card.className = "staff-directory-card";

        const fullName = [
            staff.first_name,
            staff.middle_name,
            staff.last_name
        ].filter(Boolean).join(" ");

        const name = document.createElement("h3");
        name.textContent = fullName;

        const position = document.createElement("p");
        position.textContent = "Position: " + staff.position;

        const email = document.createElement("p");
        email.textContent = "Email: " + staff.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + staff.phone;

        const date = document.createElement("p");
        date.textContent = "Registered: " + staff.created_at;

        card.append(name, position, email, phone, date);
        directoryList.appendChild(card);
    });

    modal.hidden = false;
}

// CLOSE STAFF DIRECTORY
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("staffDirectoryModal");
    const closeButton = document.getElementById("closeStaffDirectory");

    if (!modal || !closeButton) return;

    closeButton.addEventListener("click", function () {
        modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
});

// CLOSE STAFF DETAILS MODAL
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("staffDetailsModal");
    const closeButton = document.getElementById("closeStaffDetails");

    if (!modal || !closeButton) return;

    closeButton.addEventListener("click", function () {
        modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
});


// RESIDENT NOTIFICATION PAGE NAVIGATION
document.addEventListener("DOMContentLoaded", function () {

    const previousAdminNotification =
        document.getElementById("previousAdminNotificationPage");
    const nextAdminNotification =
        document.getElementById("nextAdminNotificationPage");

    if (previousAdminNotification) {
        previousAdminNotification.addEventListener("click", async function () {
            if (currentAdminNotificationPage > 1) {
                currentAdminNotificationPage--;
                await displayAdminNotifications(true);
            }
        });
    }

    if (nextAdminNotification) {
        nextAdminNotification.addEventListener("click", async function () {
            const totalPages = Math.ceil(
                adminNotifications.length / adminNotificationsPerPage
            );

            if (currentAdminNotificationPage < totalPages) {
                currentAdminNotificationPage++;
                await displayAdminNotifications(true);
            }
        });
    }

    const previousAdminRequest =
        document.getElementById("previousAdminRequestPage");
    const nextAdminRequest =
        document.getElementById("nextAdminRequestPage");

    if (previousAdminRequest) {
        previousAdminRequest.addEventListener("click", async function () {
            if (currentAdminRequestPage > 1) {
                currentAdminRequestPage--;
                await displayAdminRequests();
            }
        });
    }

    if (nextAdminRequest) {
        nextAdminRequest.addEventListener("click", async function () {
            const totalPages = Math.ceil(
                adminRequests.length / adminRequestsPerPage
            );

            if (currentAdminRequestPage < totalPages) {
                currentAdminRequestPage++;
                await displayAdminRequests();
            }
        });
    }

    const previousButton = document.getElementById(
        "previousNotificationPage"
    );

    const nextButton = document.getElementById(
        "nextNotificationPage"
    );

    if (previousButton) {
        previousButton.addEventListener("click", async function () {

            if (currentNotificationPage > 1) {
                currentNotificationPage--;
                await displayResidentNotifications(true);
            }

        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", async function () {

            const totalPages = Math.ceil(
                residentNotifications.length / notificationsPerPage
            );

            if (currentNotificationPage < totalPages) {
                currentNotificationPage++;
                await displayResidentNotifications(true);
            }

        });
    }

});
// ==================================================
// ADMIN NOTIFICATION PAGE NAVIGATION
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    const previousButton = document.getElementById(
        "previousAdminNotification"
    );

    const nextButton = document.getElementById(
        "nextAdminNotification"
    );

    if (previousButton) {
        previousButton.addEventListener("click", async function () {

            if (currentAdminNotificationPage > 1) {
                currentAdminNotificationPage--;

                await displayAdminNotifications();
            }

        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", async function () {

            const totalPages = Math.ceil(
                adminNotifications.length / adminNotificationsPerPage
            );

            if (currentAdminNotificationPage < totalPages) {
                currentAdminNotificationPage++;

                await displayAdminNotifications();
            }

        });
    }

});