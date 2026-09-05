/**
 * Smart Cafeteria Ordering System
 * File: frontend/src/js/auth.js
 */

import authService from "../services/auth.service.js";

// ===== Shared auth helpers (re-export authService-backed functions) =====

/**
 * Return the currently logged-in user (from authService/localStorage).
 * @returns {Object|null}
 */
export function getCurrentUser() {
    return authService.getCurrentUser();
}

/**
 * True when a user is currently logged in.
 * @returns {boolean}
 */
export function isLoggedIn() {
    return Boolean(authService.getCurrentUser());
}

/**
 * Log the current user out (delegates to authService.logout).
 * @returns {Promise<void>}
 */
export async function logout() {
    await authService.logout();
}

export { authService };

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth();
});

async function initializeAuth() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const logoutButton = document.getElementById("logoutBtn");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    updateAuthUI();
}

async function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const identifier = form.querySelector('#identifier')?.value?.trim();
    const password = form.querySelector('#password')?.value;

    if (!identifier || !password) {
        showMessage("Phone/Email and password are required.", "danger");
        return;
    }

    try {
        setLoading(form, true);

        const result = await authService.login({
            identifier,
            password
        });

        showMessage("Login successful.", "success");

        const redirectRole = String(result?.user?.role || '').toLowerCase();
        let redirect = "../customer/menu.html";
        if (redirectRole === "admin") {
            redirect = "../admin/dashboard.html";
        } else if (["kitchen", "kitchen_staff", "staff", "foodmaker"].includes(redirectRole)) {
            redirect = "../kitchen/dashboard.html";
        } else if (["delivery", "delivery_staff", "delivery staff", "driver", "rider"].includes(redirectRole)) {
            redirect = "../delivery/deliveries.html";
        }

        setTimeout(() => {
            window.location.href = redirect;
        }, 700);

    } catch (error) {
        showMessage(error.message, "danger");
    } finally {
        setLoading(form, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const name = form.querySelector('#regFullName')?.value?.trim();
    const email = form.querySelector('#regEmail')?.value?.trim();
    const phone = form.querySelector('#regPhone')?.value?.trim();
    const password = form.querySelector('#regPassword')?.value;
    const confirmPassword = form.querySelector('#confirmPassword')?.value;
    const agreedToTerms = form.querySelector('#agreeTerms')?.checked;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage("Please fill in all required fields.", "danger");
        return;
    }

    if (!agreedToTerms) {
        showMessage("You must agree to the Terms & Conditions.", "danger");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "danger");
        return;
    }

    try {
        setLoading(form, true);

        await authService.register({
            name,
            email,
            phone,
            password,
            confirmPassword,
            agreedToTerms
        });

        showMessage(
            "Registration successful. You can now login.",
            "success"
        );

        form.reset();

    } catch (error) {
        showMessage(error.message, "danger");
    } finally {
        setLoading(form, false);
    }
}

async function handleLogout() {
    try {
        await authService.logout();
    } catch (error) {
        console.error(error);
    }

    window.location.href = "../common/login.html";
}

function updateAuthUI() {
    const user = authService.getCurrentUser();

    const userNameElement = document.getElementById("currentUserName");

    if (userNameElement && user) {
        userNameElement.textContent = user.name || user.email;
    }
}

function setLoading(form, loading) {
    const button = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    if (!button) return;

    button.disabled = loading;

    if (loading) {
        // Save original HTML content to preserve icons/formatting if any exist
        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = "Please wait...";
    } else {
        button.innerHTML =
            button.dataset.originalHtml || button.innerHTML;
    }
}

function showMessage(message, type = "info") {
    let container = document.getElementById("authMessage");

    if (!container) {
        container = document.createElement("div");
        container.id = "authMessage";
        container.className = "alert";
        document.body.prepend(container);
    }

    container.className = `alert alert-${type}`;
    container.textContent = message;
}

window.authLogout = handleLogout;