/**
 * Delivery Staff - Profile
 * Loads the delivery staff profile (GET /auth/me) and changes the password
 * (PUT /auth/password). Delivers the result into the cached localStorage
 * profile so the shared layout/navbar shows fresh data.
 */
import api from "../api.js";

const $ = (id) => document.getElementById(id);

function showAlert(message, type) {
    const el = $("profileAlert");
    if (!el) return;
    el.textContent = message;
    el.className = "alert-banner " + (type || "success");
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 5000);
}

function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || '<i class="fa-solid fa-key"></i> Update Password';
    }
}

function getCachedProfile() {
    try {
        const raw = localStorage.getItem("userProfile") || localStorage.getItem("current_user");
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function cacheProfile(p) {
    if (!p) return;
    try {
        localStorage.setItem("userProfile", JSON.stringify(p));
        localStorage.setItem("current_user", JSON.stringify(p));
        localStorage.setItem("userName", p.name || "");
        localStorage.setItem("name", p.name || "");
    } catch (e) {}
}

function updateUi(profile) {
    const displayName = profile.name || "Delivery Staff";
    const displayEmail = profile.email || "";
    const displayRole = (profile.role || "").toUpperCase() || "DELIVERY STAFF";

    $("profileName").textContent = displayName;
    $("profileEmail").textContent = displayEmail;
    $("profileRole").textContent = displayRole;

    const avatar = $("profileAvatar");
    if (avatar) {
        if (profile.avatar) {
            avatar.innerHTML = '<img src="' + profile.avatar + '" alt="Avatar" class="navbar-avatar-img">';
        } else if (profile.name) {
            avatar.textContent = profile.name.charAt(0).toUpperCase();
        }
    }
}

async function loadProfile() {
    // First render from cached local data so the UI is instant.
    const cached = getCachedProfile();
    if (cached) updateUi(cached);

    try {
        const data = await api.get("/auth/me");
        if (data && data.user) {
            cacheProfile(data.user);
            updateUi(data.user);
        }
    } catch (e) {
        console.log("Could not refresh profile:", e.message);
        if (!cached) showAlert("Could not load your profile from the server.", "error");
    }
}

async function changePassword(e) {
    e.preventDefault();
    const btn = $("changePasswordBtn");
    const current = $("currentPassword").value;
    const newPass = $("newPassword").value;
    const confirm = $("confirmPassword").value;

    if (!current || !newPass || !confirm) {
        showAlert("All fields are required", "error");
        return;
    }
    if (newPass.length < 6) {
        showAlert("New password must be at least 6 characters", "error");
        return;
    }
    if (newPass !== confirm) {
        showAlert("Passwords do not match", "error");
        return;
    }

    setLoading(btn, true);
    try {
        const data = await api.put("/auth/password", { currentPassword: current, newPassword: newPass, confirmPassword: confirm });
        if (data.token) localStorage.setItem("auth_token", data.token);
        showAlert("Password updated successfully. Please sign out and sign back in with your new password.");
        $("passwordForm").reset();
    } catch (error) {
        showAlert("Failed to update password: " + (error.message || error), "error");
    } finally {
        setLoading(btn, false);
    }
}

function bindEvents() {
    const form = $("passwordForm");
    if (form) form.addEventListener("submit", changePassword);

    document.querySelectorAll(".toggle-password-icon").forEach(function (icon) {
        icon.addEventListener("click", function () {
            const input = document.getElementById(icon.getAttribute("data-target"));
            if (!input) return;
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);
            icon.title = isPassword ? "Hide password" : "Show password";
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    loadProfile();
});