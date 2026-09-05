/**
 * Smart Cafeteria Ordering System
 * File: Frontend/src/js/profile.js
 *
 * Customer profile page logic + a global helper that keeps every profile icon
 * and user-name across the app in sync with the saved profile.
 */

document.addEventListener("DOMContentLoaded", () => {
    initProfileUI();
    initProfilePage();
});

/* ==========================================================================
   0. Global Profile UI Sync (works across all customer pages)
   ========================================================================== */
let populateUserUI = () => {};
async function initProfileUI() {
    try {
        const mod = await import("./profile-ui.js");
        populateUserUI = mod.populateUserUI || populateUserUI;
        populateUserUI();
    } catch (e) {
        console.warn("profile-ui module unavailable:", e);
    }
}

/* ==========================================================================
   1. Header Dropdown Menu Logic (Works across all pages)
   ========================================================================== */
function initProfilePage() {
    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdownMenu = document.getElementById("user-dropdown-menu");

    if (userMenuBtn && userDropdownMenu) {
        userMenuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            userDropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (!userMenuBtn.contains(event.target) && !userDropdownMenu.contains(event.target)) {
                userDropdownMenu.classList.remove("show");
            }
        });
    }

    /* ======================================================================
       2. Profile Page Form & LocalStorage Logic
       ====================================================================== */
    const profileForm = document.getElementById("profile-form");

    if (profileForm) {
        const nameInput = document.getElementById("customer-name");
        const usernameInput = document.getElementById("customer-username");
        const phoneInput = document.getElementById("customer-phone");
        const emailInput = document.getElementById("customer-email");
        const langSelect = document.getElementById("preferred-language");
        const diningTypeSelect = document.getElementById("default-dining-type");
        const tableInput = document.getElementById("default-table-number");
        const addressInput = document.getElementById("customer-address");

        const sidebarName = document.getElementById("sidebar-user-name");
        const sidebarPhone = document.getElementById("sidebar-user-phone");
        const avatarPreview = document.getElementById("avatar-preview");
        const avatarUpload = document.getElementById("avatar-upload");
        const alertBox = document.getElementById("profile-alert");

        const defaultProfile = {
            name: "Abebe Kebede",
            phone: "0911234567",
            email: "abebe.k@example.com",
            language: "en",
            diningType: "dine-in",
            tableNumber: "Table 04",
            avatar: ""
        };

        function loadProfileData() {
            let savedData = defaultProfile;
            try {
                const parsed = JSON.parse(localStorage.getItem("userProfile") || "null");
                if (parsed) savedData = Object.assign({}, defaultProfile, parsed);
            } catch (e) { /* ignore */ }

            const globalLang = localStorage.getItem("scos_language") || localStorage.getItem("cafeteria_language") || savedData.language || "en";

            if (nameInput) nameInput.value = savedData.name || "";
            if (usernameInput) usernameInput.value = savedData.username || "";
            if (phoneInput) phoneInput.value = savedData.phone || "";
            if (emailInput) emailInput.value = savedData.email || "";
            if (langSelect) langSelect.value = globalLang;
            if (diningTypeSelect) diningTypeSelect.value = savedData.diningType || "dine-in";
            if (tableInput) tableInput.value = savedData.tableNumber || "";
            if (addressInput) addressInput.value = savedData.address || "";

            if (sidebarName) sidebarName.textContent = savedData.name || "Customer";
            if (sidebarPhone) sidebarPhone.textContent = savedData.phone || "No phone added";
            if (avatarPreview && savedData.avatar) {
                avatarPreview.src = savedData.avatar;
            }

            if (langSelect) {
                langSelect.addEventListener("change", function () {
                    const v = this.value;
                    try { localStorage.setItem("scos_language", v); localStorage.setItem("cafeteria_language", v); } catch (e) {}
                    if (window.setLanguage) window.setLanguage(v);
                    if (window.applyTranslations) window.applyTranslations();
                });
            }
            window.addEventListener("language:changed", function (e) {
                const lang = e.detail && e.detail.language;
                if (lang && langSelect) langSelect.value = lang;
            });
            window.addEventListener("languageChanged", function (e) {
                const lang = e.detail && e.detail.language;
                if (lang && langSelect) langSelect.value = lang;
            });
        }

        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedProfile = {
                name: nameInput.value.trim(),
                username: usernameInput ? usernameInput.value.trim() : "",
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                address: addressInput ? addressInput.value.trim() : "",
                language: langSelect.value,
                diningType: diningTypeSelect.value,
                tableNumber: tableInput.value.trim(),
                avatar: (avatarPreview && avatarPreview.src) ? avatarPreview.src : ""
            };

            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
            try { localStorage.setItem("scos_language", updatedProfile.language); localStorage.setItem("cafeteria_language", updatedProfile.language); } catch (e) {}
            if (window.setLanguage) window.setLanguage(updatedProfile.language);

            // Sync current_user so navbar/header reflect the new profile
            try {
                const savedCurrent = JSON.parse(localStorage.getItem("current_user")) || {};
                localStorage.setItem("current_user", JSON.stringify(Object.assign(savedCurrent, {
                    id: savedCurrent.id,
                    name: updatedProfile.name,
                    username: updatedProfile.username,
                    phone: updatedProfile.phone,
                    email: updatedProfile.email,
                    address: updatedProfile.address,
                    avatar: updatedProfile.avatar,
                    role: savedCurrent.role || "customer"
                })));
            } catch (e) {}

            try { localStorage.setItem("userName", updatedProfile.name); localStorage.setItem("name", updatedProfile.name); } catch (e) {}

            // Persist profile (including avatar) to the backend permanently
            try {
                const token = localStorage.getItem("auth_token");
                if (token) {
                    const backendBody = {
                        name: updatedProfile.name,
                        phone: updatedProfile.phone,
                        email: updatedProfile.email,
                        address: updatedProfile.address || undefined
                    };
                    if (updatedProfile.username) backendBody.username = updatedProfile.username;
                    if (updatedProfile.avatar) backendBody.avatar = updatedProfile.avatar;

                    let res;
                    res = await fetch(window.__API_URL + "/auth/profile", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                        body: JSON.stringify(backendBody)
                    });

                    if (res && res.ok) {
                        try {
                            const data = await res.json();
                            if (data && data.user) {
                                const merged = Object.assign(
                                    JSON.parse(localStorage.getItem("current_user") || "{}"),
                                    data.user,
                                    { avatar: updatedProfile.avatar || data.user.avatar }
                                );
                                localStorage.setItem("current_user", JSON.stringify(merged));
                            }
                        } catch (jsonErr) { /* ignore */ }
                    } else {
                        console.warn("Profile backend sync returned non-OK:", res && res.status);
                    }
                }
            } catch (err) {
                console.warn("Profile sync to backend skipped:", err);
            }

            // Update every profile icon / name on the page from the saved profile
            try { populateUserUI(); } catch (e) {}

            if (sidebarName) sidebarName.textContent = updatedProfile.name;
            if (sidebarPhone) sidebarPhone.textContent = updatedProfile.phone;

            showAlert("Profile updated successfully!", "success");
        });

        if (avatarUpload && avatarPreview) {
            avatarUpload.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target.result;
                        // Persist the new avatar to local storage immediately so
                        // populateUserUI() uses the real image (not a stale profile).
                        try {
                            const savedCurrent = JSON.parse(localStorage.getItem("current_user") || "{}");
                            savedCurrent.avatar = dataUrl;
                            localStorage.setItem("current_user", JSON.stringify(savedCurrent));
                            const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
                            savedProfile.avatar = dataUrl;
                            localStorage.setItem("userProfile", JSON.stringify(savedProfile));
                        } catch (err) { /* ignore */ }

                        avatarPreview.src = dataUrl;
                        // Reflect the new avatar immediately on every icon
                        try { populateUserUI(); } catch (e) {}
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function showAlert(message, type = "success") {
            if (!alertBox) return;
            alertBox.textContent = message;
            alertBox.className = `alert-box alert-${type}`;
            alertBox.style.display = "block";
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3500);
        }

        loadProfileData();
    }

    /* ======================================================================
       3. Password Change Handler
       ====================================================================== */
    const passwordForm = document.getElementById("password-change-form");
    if (passwordForm) {
        passwordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const cur = document.getElementById("current-password").value;
            const nw = document.getElementById("new-password").value;
            const cf = document.getElementById("confirm-password").value;
            const alertEl = document.getElementById("password-alert");
            const btn = document.getElementById("change-password-btn");

            if (!cur || !nw || !cf) {
                showPasswordAlert("All fields are required", "error"); return;
            }
            if (nw.length < 6) {
                showPasswordAlert("New password must be at least 6 characters", "error"); return;
            }
            if (nw !== cf) {
                showPasswordAlert("Passwords do not match", "error"); return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

            try {
                const token = localStorage.getItem("auth_token");
                const res = await fetch(window.__API_URL + "/auth/change-password", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                    body: JSON.stringify({ currentPassword: cur, newPassword: nw, confirmPassword: cf })
                });
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || "Failed to change password");
                }
                // Store new token
                if (data.token) {
                    localStorage.setItem("auth_token", data.token);
                }
                passwordForm.reset();
                showPasswordAlert("Password updated successfully. Please sign out and sign back in with your new password.", "success");
            } catch (err) {
                showPasswordAlert(err.message || "Failed to change password", "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-key"></i> Update Password';
            }
        });
    }

    function showPasswordAlert(message, type) {
        const el = document.getElementById("password-alert");
        if (!el) return;
        el.textContent = message;
        el.className = "alert-box alert-" + type;
        el.style.display = "block";
        setTimeout(() => { el.style.display = "none"; }, 5000);
    }

    // Password show/hide toggle
    document.querySelectorAll(".toggle-password-icon").forEach((icon) => {
        icon.addEventListener("click", () => {
            const target = document.getElementById(icon.getAttribute("data-target"));
            if (!target) return;
            const isPassword = target.type === "password";
            target.type = isPassword ? "text" : "password";
            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);
            icon.title = isPassword ? "Hide password" : "Show password";
        });
    });

    /* ======================================================================
       4. Global Logout Handler (Clears auth status and redirects)
       ====================================================================== */
    const logoutLinks = document.querySelectorAll(".logout-link, .logout");

    logoutLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("current_user");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("userName");
            localStorage.removeItem("name");
            localStorage.removeItem("userRole");
            localStorage.removeItem("role");
            const redirectUrl = link.getAttribute("href") || "login.html";
            window.location.href = redirectUrl;
        });
    });
}
