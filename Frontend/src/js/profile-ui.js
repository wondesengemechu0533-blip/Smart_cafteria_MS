/**
 * Smart Cafeteria Ordering System
 * File: Frontend/src/js/profile-ui.js
 *
 * Shared helper that keeps every profile icon / user-name on the page in sync
 * with the logged-in user's profile stored in localStorage (current_user or
 * userProfile). It renders the user's avatar image when one is set, otherwise
 * a gradient circular avatar with their initial.
 */

function getCurrentProfile() {
    let current = null;
    try {
        current = JSON.parse(localStorage.getItem("current_user") || "null");
    } catch (e) {
        current = null;
    }
    if (current && (current.name || current.avatar || current.phone)) {
        return current;
    }
    try {
        const fallback = JSON.parse(localStorage.getItem("userProfile") || "null");
        if (fallback && (fallback.name || fallback.avatar)) {
            return fallback;
        }
    } catch (e) {
        /* ignore */
    }
    return current;
}

/**
 * Build a small circular avatar image as a data URI using the user's initial.
 * Used when the user has not uploaded a profile picture yet.
 */
function initialsAvatar(name, size) {
    const initial = (name || "U").trim().charAt(0).toUpperCase() || "U";
    const px = size || 72;
    const svg =
        "<svg xmlns='http://www.w3.org/2000/svg' width='" + px + "' height='" + px + "'>" +
        "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0' stop-color='%233b82f6'/>" +
        "<stop offset='1' stop-color='%232563eb'/>" +
        "</linearGradient></defs>" +
        "<circle cx='" + px / 2 + "' cy='" + px / 2 + "' r='" + px / 2 + "' fill='url(%23g)'/>" +
        "<text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' fill='#ffffff' font-size='" + Math.round(px * 0.46) + "' font-family='Arial,sans-serif' font-weight='600'>" + initial + "</text>" +
        "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/**
 * Resolve an avatar value to a displayable <img> src.
 * Backend-served files are stored as relative /uploads/... paths; those must
 * be turned into absolute URLs pointing at the API host, otherwise the browser
 * resolves them against the frontend origin and returns 404.
 */
function resolveAvatarSrc(avatar) {
    if (!avatar) return "";
    const value = String(avatar);
    // data: and http(s): URLs are used as-is.
    if (value.startsWith("data:") || /^https?:\/\//i.test(value)) {
        return value;
    }
    // Relative /uploads/... paths -> absolute against the backend host.
    if (value.startsWith("/uploads/")) {
        let origin = window.__API_BASE;
        if (typeof location !== "undefined" && location.origin) {
            // The backend always runs on port 5000 while the frontend uses a
            // dev-server port (e.g. 5500/5501). Re-map the port accordingly,
            // keeping http/https from the current page.
            origin = location.origin.replace(/:\d+$/, "") + ":5000";
        }
        return origin + value;
    }
    return value;
}

function setAvatar(img, profile) {
    if (!img) return;
    const hasImage = profile && profile.avatar;
    if (hasImage) {
        img.src = resolveAvatarSrc(profile.avatar);
    } else {
        img.src = initialsAvatar(profile ? profile.name : "", 72);
    }
    img.onerror = function () {
        this.onerror = null;
        this.src = initialsAvatar(profile ? profile.name : "", 72);
    };
    img.style.visibility = "visible";
    img.style.display = "";
}

/**
 * Update every profile icon / name element that exists on the current page.
 */
export function populateUserUI() {
    const profile = getCurrentProfile();

    // Avatar images: any .avatar-img, plus the navbar profile button image
    const avatars = document.querySelectorAll(".avatar-img, #user-menu-btn img");
    avatars.forEach(function (img) {
        setAvatar(img, profile);
    });

    // User name text
    document.querySelectorAll(".user-name, .user-greeting strong").forEach(function (el) {
        el.textContent = profile && profile.name ? profile.name : "User";
    });

    // Profile page sidebar
    const sidebarName = document.getElementById("sidebar-user-name");
    if (sidebarName) {
        sidebarName.textContent = (profile && profile.name) || "Customer";
    }
    const sidebarPhone = document.getElementById("sidebar-user-phone");
    if (sidebarPhone) {
        sidebarPhone.textContent = (profile && profile.phone) || "No phone added";
    }
    const avatarPreview = document.getElementById("avatar-preview");
    if (avatarPreview) {
        setAvatar(avatarPreview, profile);
    }

    // Customer sidebar profile card (customer-sidebar.js)
    const scName = document.getElementById("sidebarCustomerName");
    if (scName) {
        scName.textContent = (profile && profile.name) || "Guest";
    }
    const scMail = document.getElementById("sidebarCustomerMail");
    if (scMail) {
        scMail.textContent = (profile && profile.email) || "customer";
    }
    const scImg = document.querySelector(".customer-sidebar .sidebar-card .avatar-img");
    if (scImg) {
        setAvatar(scImg, profile);
    }
}

export { getCurrentProfile };

// Expose helpers on window so non-module scripts / injected components
// (e.g. customer-sidebar.js) can also use them.
try {
    window.populateUserUI = populateUserUI;
    window.getCurrentProfile = getCurrentProfile;
} catch (e) { /* ignore */ }

// Auto-run as soon as the document is interactive.
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", populateUserUI);
    } else {
        populateUserUI();
    }
}
