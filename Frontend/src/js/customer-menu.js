/**
 * Smart Cafeteria Ordering System
 * File: Frontend/src/js/customer-menu.js
 *
 * Loads menu items from the backend API (/api/v1/menu) and renders
 * them into the customer menu page. Falls back to static data if
 * the backend is unavailable.
 */

import api from "./api.js";

const CUSTOMER_MENU = {

    STATIC_FALLBACK_ITEMS: [],

    async loadStaticFallback() {
        try {
            const { COMPLETE_MENU_ITEMS } = await import("../js/static-menu-data.js");
            this.STATIC_FALLBACK_ITEMS = COMPLETE_MENU_ITEMS || [];
        } catch (e) {
            this.STATIC_FALLBACK_ITEMS = [];
        }
    },

    CART_KEY: "smart_cafeteria_cart",

    // Database category values mapped onto the static filter pills
    CATEGORY_ALIASES: {
        "mains": "main-meals",
        "main-meals": "main-meals",
        "lunch": "main-meals",
        "dinner": "main-meals",
        "breakfast": "breakfast",
        "fasting": "fasting",
        "beverages": "beverages",
        "drinks": "beverages",
        "snacks": "snacks"
    },

    PLACEHOLDER_IMAGE:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='16'>Food Item</text></svg>"

};


document.addEventListener("DOMContentLoaded", function () {

    const grid =
        document.getElementById("food-grid-container");

    const resultsCount =
        document.getElementById("results-count");

    const noResults =
        document.getElementById("no-results");


    // =========================================================
    // HELPERS
    // =========================================================

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function resolveImage(image) {

        if (!image) {
            return "";
        }

        const value = String(image);

        if (
            value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("data:")
        ) {
            return value;
        }

        // Backend upload paths (e.g., "/uploads/menu/...") - serve from backend
        if (value.startsWith("/uploads/")) {
            return "http://localhost:5000" + value;
        }

        // Local folder images: map "/assets/..." to "/public/assets/..."
        // so they always load from the frontend folder (no backend needed).
        if (value.startsWith("/assets/")) {
            return "/public" + value;
        }

        // Relative paths ("assets/..." or plain paths) also point to the folder
        if (value.startsWith("/") === false) {
            return "/public/" + value.replace(/^\.?\//, "");
        }

        return value;
    }


    function mapCategory(category) {

        const key = String(category || "")
            .toLowerCase()
            .trim();

        return CUSTOMER_MENU.CATEGORY_ALIASES[key] || key;
    }


    function isUnavailable(item) {

        return item.availability === false ||
            item.isAvailable === false;
    }

    function getLang() {
        try { return localStorage.getItem("scos_language") || localStorage.getItem("cafeteria_language") || "en"; } catch(e){ return "en"; }
    }
    function t(key) {
        const L = {
            en: { available: "Available", notAvailable: "Not Available", unavailable: "Unavailable", add: "Add", viewDetails: "View Details", browse: "Browse" },
            am: { available: "ይገኛል", notAvailable: "አይገኝም", unavailable: "አይገኝም", add: "ጨምር", viewDetails: "ዝርዝር ይመልከቱ", browse: "ምግቦችን ይመልከቱ" }
        };
        const lang = getLang();
        return (L[lang] && L[lang][key]) || (L.en[key] || key);
    }


    // =========================================================
    // RENDER
    // =========================================================

    function renderMenu(items) {

        if (!grid) {
            return;
        }

        if (!items.length) {

            grid.innerHTML = "";

            if (noResults) {
                noResults.classList.remove("hidden");
            }

            triggerAllFilter();

            return;
        }


        const cardsHTML = items.map(function (item) {

            const id =
                escapeHTML(item.id);

            const lang = getLang();
            const name =
                escapeHTML(item.name?.[lang] || item.name?.en || item.name?.am || "");

            const description =
                escapeHTML(item.description?.[lang] || item.description?.en || "");

            const price =
                Number(item.price) || 0;

            const category =
                mapCategory(item.category);

            const image =
                escapeHTML(resolveImage(item.image));

            const displayTitle = name;

            const unavailable =
                isUnavailable(item);

            const cardClass =
                unavailable
                    ? "food-card is-unavailable"
                    : "food-card";

            const statusHTML =
                unavailable
                    ? `
                    <span class="status-stock out-of-stock">
                        <i class="fa-solid fa-circle-xmark"></i>
                        ${t("notAvailable")}
                    </span>`
                    : `
                    <span class="status-stock in-stock">
                        <i class="fa-solid fa-circle-check"></i>
                        ${t("available")}
                    </span>`;

            const addButtonHTML =
                unavailable
                    ? `
                        <button
                            type="button"
                            class="btn btn-primary add-to-cart-btn"
                            disabled
                            aria-disabled="true"
                            aria-label="Currently unavailable"
                            title="Currently unavailable">

                            <i class="fa-solid fa-circle-minus"></i>
                            ${t("unavailable")}

                        </button>`
                    : `
                        <button
                            type="button"
                            class="btn btn-primary add-to-cart-btn"
                            data-id="${id}"
                            data-name="${name}"
                            data-price="${price}"
                            data-image="${image}">

                            <i class="fa-solid fa-plus"></i>
                            ${t("add")}

                        </button>`;

            return `
            <article class="${cardClass}"
                     data-category="${category}"
                     data-id="${id}">

                <div class="food-card-image">

                    <img
                        src="${image || CUSTOMER_MENU.PLACEHOLDER_IMAGE}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${CUSTOMER_MENU.PLACEHOLDER_IMAGE}'"
                    >

                </div>

                <div class="food-card-body">

                    <div class="food-header">

                        <h3 class="food-title">
                            ${displayTitle}
                        </h3>

                        <span class="food-price">
                            ${price} <small>ብር</small>
                        </span>

                    </div>

                    <p class="food-description">
                        ${description || "Delicious item from our kitchen."}
                    </p>

                    <div class="food-card-footer">

                        ${statusHTML}

                        <div class="card-actions">

                            <a href="food-details.html?id=${id}"
                               class="btn btn-icon-secondary"
                               title="View Details">

                                <i class="fa-solid fa-eye"></i>

                            </a>

                            ${addButtonHTML}

                        </div>

                    </div>

                </div>

            </article>`;

        }).join("");


        grid.innerHTML = cardsHTML;

        if (noResults) {
            noResults.classList.add("hidden");
        }

        triggerAllFilter();
    }


    function triggerAllFilter() {

        const allButton =
            document.querySelector(
                '.category-pill[data-category="all"]'
            );

        // Re-runs menu.js filterMenu() against the now-rendered
        // cards so results count + empty state stay in sync.
        if (allButton) {
            allButton.click();
        }
    }


    // =========================================================
    // LOADING / ERROR STATES
    // =========================================================

    function renderError() {

        if (!grid) {
            return;
        }

        grid.innerHTML = `

            <div class="menu-state menu-error" id="menu-error">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>
                    Unable to Load Menu
                </h3>

                <p>
                    We couldn't reach the menu right now.
                    Please check your connection and try again.
                </p>

                <button
                    type="button"
                    class="btn btn-primary"
                    id="menu-retry-btn">

                    <i class="fa-solid fa-rotate-right"></i>
                    Try Again

                </button>

            </div>`;

        if (resultsCount) {
            resultsCount.textContent =
                "Menu unavailable";
        }

        if (noResults) {
            noResults.classList.add("hidden");
        }
    }


    function showLoading() {

        if (resultsCount) {
            resultsCount.textContent =
                "Loading menu...";
        }
    }


    // =========================================================
    // DATA LOADING
    // =========================================================

    async function loadMenu() {

        showLoading();

        // Try to fetch from backend API first
        try {
            const response = await api.get("/menu?limit=100");
            const items = response?.items || response || [];
            if (items.length > 0) {
                renderMenu(items);
                return;
            }
        } catch (apiError) {
            console.warn("Backend API unavailable, trying static fallback:", apiError.message);
        }

        // Fallback to static data
        try {
            if (CUSTOMER_MENU.STATIC_FALLBACK_ITEMS.length === 0) {
                await CUSTOMER_MENU.loadStaticFallback();
            }
            renderMenu(CUSTOMER_MENU.STATIC_FALLBACK_ITEMS);
        } catch (error) {
            console.error("Failed to load menu:", error);
            renderError();
        }
    }


    // =========================================================
    // EVENTS
    // =========================================================

    document.addEventListener(
        "click",
        function (event) {

            const retryButton =
                event.target.closest("#menu-retry-btn");

            if (retryButton) {
                loadMenu();
            }
        }
    );


    // =========================================================
    // INITIAL LOAD + LANGUAGE LISTENER
    // =========================================================

    // Load static fallback data first (async)
    CUSTOMER_MENU.loadStaticFallback().then(() => {
        loadMenu();
    });

    window.addEventListener("language:changed", loadMenu);
    window.addEventListener("languageChanged", loadMenu);
    // Also re-apply cart badge translation after render
    window.addEventListener("language:changed", () => { if (window.applyTranslations) window.applyTranslations(); });

});