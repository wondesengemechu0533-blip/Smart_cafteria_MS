import authService from "../services/auth.service.js";
import { Storage } from "../js/utils/storage.js";
import { STORAGE_KEYS } from "../js/config.js";

/**
 * Top Navigation Bar Component
 */
export function renderNavbar(containerId = "navbar-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = authService.getCurrentUser();
    const cart = Storage.get(STORAGE_KEYS.cart, []);
    const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    const userNavHtml = user ? `
        <span class="user-greeting">Hello, <strong>${user.name}</strong></span>
        <button id="logoutBtn" class="nav-btn btn-logout">Logout</button>
    ` : `
        <a href="../common/login.html" class="nav-btn">Login</a>
        <a href="../common/register.html" class="nav-btn btn-primary">Register</a>
    `;

    container.innerHTML = `
        <nav class="main-navbar">
            <div class="nav-brand">
                <a href="../common/index.html">
                    <img src="../../public/assets/images/logo.png" alt="Logo" class="nav-logo" onerror="this.style.display='none'">
                    <span>Smart Cafeteria</span>
                </a>
            </div>
            <div class="nav-links">
                <a href="../customer/menu.html">Menu</a>
                <a href="../customer/order-tracking.html">Track Order</a>
                <a href="../customer/cart.html" class="cart-link">
                    🛒 Cart <span class="cart-badge">${cartCount}</span>
                </a>
            </div>
            <div class="nav-auth">
                ${userNavHtml}
            </div>
        </nav>
    `;

    // Bind Logout event
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => authService.logout());
    }
}