/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - MENU MODULE
 * ================================================================
 * Handles:
 * - Menu browsing
 * - Searching
 * - Category filtering
 * - Sorting
 * - Add to cart
 * - Cart count
 * - Menu item details
 * - Admin menu operations
 * ================================================================
 */

import { MENU_ITEMS } from "./mock-menu-data.js";
const MENU_CATEGORIES = window.MENU_CATEGORIES || [];

export function showToast(message, type = "success") {
    if (window.AdminToast && typeof window.AdminToast.show === "function") {
        window.AdminToast.show(message, type);
        return;
    }
    window.alert(message);
}

function showMainLoginRequired() {
    if (document.getElementById("login-required-modal")) return;

    const modal = document.createElement("div");
    modal.id = "login-required-modal";
    modal.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;";
    modal.innerHTML = `
        <div style="background:#ffffff;color:#0f172a;border-radius:16px;max-width:420px;width:100%;padding:32px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);font-family:'Poppins',sans-serif;">
            <div style="font-size:3rem;margin-bottom:12px;">🔒</div>
            <h3 style="margin:0 0 10px;font-size:1.35rem;font-weight:700;color:#0f172a;">Please register or log in to order</h3>
            <p style="margin:0 0 24px;font-size:0.95rem;color:#475569;line-height:1.5;">You need to log in to add items to your cart and place orders.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <a href="src/pages/common/login.html" style="display:block;width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;font-weight:600;font-size:0.95rem;text-align:center;">Login</a>
                <a href="src/pages/common/register.html" style="display:block;width:100%;padding:12px;border-radius:10px;background:transparent;color:#2563eb;border:2px solid #2563eb;text-decoration:none;font-weight:600;font-size:0.95rem;text-align:center;box-sizing:border-box;">Register</a>
                <button type="button" id="login-required-close-main" style="margin-top:6px;border:none;background:none;color:#64748b;cursor:pointer;font-size:0.85rem;text-decoration:underline;padding:6px;">Close</button>
            </div>
        </div>`;

    document.body.appendChild(modal);

    const close = modal.querySelector("#login-required-close-main");
    if (close) {
        close.addEventListener("click", function () {
            modal.remove();
        });
    }
    modal.addEventListener("click", function (e) {
        if (e.target === modal) modal.remove();
    });
}

// ================================================================
// 1. MENU STATE
// ================================================================

let menuItems = Array.isArray(MENU_ITEMS) ? [...MENU_ITEMS] : [];
let selectedCategory = null;
let searchQuery = "";
let sortBy = "name";

// ================================================================
// 2. HELPER FUNCTIONS
// ================================================================

/**
 * Get English or localized name from menu item safely.
 */
function getItemName(item, language = "en") {
    if (!item) return "";
    if (typeof item.name === "string") return item.name;

    return (
        item.name?.[language] ||
        item.name?.en ||
        item.name?.am ||
        ""
    );
}

/**
 * Get English or localized description from menu item safely.
 */
function getItemDescription(item, language = "en") {
    if (!item) return "";
    if (typeof item.description === "string") return item.description;

    return (
        item.description?.[language] ||
        item.description?.en ||
        item.description?.am ||
        ""
    );
}

/**
 * Safely display toast message.
 */
function notify(message, type = "success") {
    try {
        if (typeof showToast === "function") {
            showToast(message, type);
        } else {
            alert(message);
        }
    } catch (error) {
        console.warn("Toast unavailable:", error);
        alert(message);
    }
}

/**
 * Escape HTML to prevent broken HTML when displaying menu data.
 */
function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ================================================================
// 3. MENU FUNCTIONS
// ================================================================

/**
 * Get all menu items filtered and sorted.
 */
export function getMenuItems(filters = {}) {
    let items = [...menuItems];

    // Filter by category
    const activeCategory = filters.category !== undefined ? filters.category : selectedCategory;
    if (activeCategory) {
        items = items.filter(item => item.category === activeCategory);
    }

    // Filter by search query
    const query = filters.search !== undefined ? filters.search : searchQuery;
    if (query && query.trim() !== "") {
        const q = query.trim().toLowerCase();

        items = items.filter(item => {
            const englishName = getItemName(item, "en").toLowerCase();
            const amharicName = getItemName(item, "am").toLowerCase();
            const englishDescription = getItemDescription(item, "en").toLowerCase();
            const amharicDescription = getItemDescription(item, "am").toLowerCase();

            return (
                englishName.includes(q) ||
                amharicName.includes(q) ||
                englishDescription.includes(q) ||
                amharicDescription.includes(q)
            );
        });
    }

    // Filter availability
    if (filters.available !== undefined) {
        items = items.filter(item => Boolean(item.availability) === filters.available);
    }

    // Sort
    const sortMethod = filters.sort || sortBy;
    switch (sortMethod) {
        case "name":
            items.sort((a, b) => getItemName(a, "en").localeCompare(getItemName(b, "en")));
            break;

        case "price-low":
            items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
            break;

        case "price-high":
            items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
            break;

        case "popular":
            items.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
            break;

        default:
            break;
    }

    return items;
}

// ================================================================
// 4. GET ITEM BY ID
// ================================================================

export function getMenuItemById(id) {
    if (id === null || id === undefined) return null;
    return menuItems.find(item => String(item.id) === String(id)) || null;
}

// ================================================================
// 5. GET ITEMS BY CATEGORY
// ================================================================

export function getMenuItemsByCategory(categoryId) {
    return menuItems.filter(item => item.category === categoryId);
}

// ================================================================
// 6. GET CATEGORIES
// ================================================================

export function getCategories(language = "en") {
    if (!Array.isArray(MENU_CATEGORIES)) return [];

    return MENU_CATEGORIES.map(category => {
        const count = menuItems.filter(item => item.category === category.id).length;

        return {
            ...category,
            name: category.name?.[language] || category.name?.en || category.id,
            count
        };
    });
}

// ================================================================
// 7. GET CATEGORY BY ID
// ================================================================

export function getCategoryById(categoryId, language = "en") {
    if (!Array.isArray(MENU_CATEGORIES)) return null;

    const category = MENU_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return null;

    return {
        ...category,
        name: category.name?.[language] || category.name?.en || category.id
    };
}

// ================================================================
// 8. SEARCH MENU
// ================================================================

export function searchMenuItems(query) {
    if (!query || query.trim() === "") return getMenuItems();
    return getMenuItems({ search: query });
}

// ================================================================
// 9. CATEGORY FILTER STATE
// ================================================================

export function setCategoryFilter(categoryId) {
    selectedCategory = categoryId && categoryId.trim() !== "" ? categoryId : null;
}

export function getCategoryFilter() {
    return selectedCategory;
}

export function clearCategoryFilter() {
    selectedCategory = null;
}

// ================================================================
// 10. SEARCH STATE
// ================================================================

export function setSearchQuery(query) {
    searchQuery = typeof query === "string" ? query : "";
}

export function getSearchQuery() {
    return searchQuery;
}

export function clearSearchQuery() {
    searchQuery = "";
}

// ================================================================
// 11. SORT STATE
// ================================================================

export function setSortMethod(sort) {
    const validSortMethods = ["name", "price-low", "price-high", "popular"];
    if (validSortMethods.includes(sort)) {
        sortBy = sort;
    }
}

export function getSortMethod() {
    return sortBy;
}

// ================================================================
// 12. FEATURED ITEMS
// ================================================================

export function getFeaturedItems(limit = 6) {
    const safeLimit = Math.max(0, Number(limit) || 6);
    return menuItems.slice(0, safeLimit);
}

// ================================================================
// 13. RELATED ITEMS
// ================================================================

export function getRelatedItems(itemId, limit = 4) {
    const item = getMenuItemById(itemId);
    if (!item) return [];

    const safeLimit = Math.max(0, Number(limit) || 4);

    return menuItems
        .filter(menuItem => String(menuItem.id) !== String(item.id) && menuItem.category === item.category)
        .slice(0, safeLimit);
}

// ================================================================
// 14. COUNTS
// ================================================================

export function getAvailableCount() {
    return menuItems.filter(item => item.availability === true).length;
}

export function getTotalCount() {
    return menuItems.length;
}

// ================================================================
// 15. PRICE RANGE
// ================================================================

export function getPriceRange() {
    if (menuItems.length === 0) return { min: 0, max: 0 };

    const prices = menuItems
        .map(item => Number(item.price))
        .filter(price => Number.isFinite(price));

    if (prices.length === 0) return { min: 0, max: 0 };

    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}

// ================================================================
// 16. CART FUNCTIONS
// ================================================================

export function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Error reading cart:", error);
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    window.dispatchEvent(
        new StorageEvent("storage", {
            key: "cart",
            newValue: JSON.stringify(cart)
        })
    );
}

export function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    const cartCountElements = document.querySelectorAll("#cart-count, .cart-count");
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems === 0 ? "none" : "inline-flex";
    });
}

export function addToCart(itemId) {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true" || Boolean(localStorage.getItem("auth_token"));
    if (!loggedIn) {
        window.location.href = "../common/register.html";
        return false;
    }

    const menuItem = getMenuItemById(itemId);

    if (!menuItem) {
        notify("Food item not found.", "error");
        return false;
    }

    if (menuItem.availability === false) {
        notify(`${getItemName(menuItem)} is currently unavailable.`, "error");
        return false;
    }

    let cart = getCart();
    const itemIdString = String(menuItem.id);

    const existingItem = cart.find(item => String(item.id) === itemIdString);

    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity || 0) + 1;
    } else {
        cart.push({
            id: itemIdString,
            name: getItemName(menuItem, "en"),
            price: Number(menuItem.price || 0),
            quantity: 1,
            image: menuItem.image || menuItem.img || "",
            category: menuItem.category || "",
            description: getItemDescription(menuItem, "en")
        });
    }

    saveCart(cart);
    notify(`${getItemName(menuItem)} added to cart!`, "success");
    return true;
}

export function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => String(item.id) !== String(itemId));
    saveCart(cart);
}

export function changeCartQuantity(itemId, delta) {
    let cart = getCart();
    const item = cart.find(item => String(item.id) === String(itemId));

    if (!item) return;

    item.quantity = Number(item.quantity || 0) + Number(delta || 0);

    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => String(cartItem.id) !== String(itemId));
    }

    saveCart(cart);
}

// ================================================================
// 17. ADMIN MENU FUNCTIONS
// ================================================================

export async function addMenuItem(itemData = {}) {
    try {
        if (!itemData.name || !itemData.price || !itemData.category) {
            return { success: false, error: "Name, price, and category are required" };
        }

        const numericPrice = Number(itemData.price);
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            return { success: false, error: "Price must be a valid positive number" };
        }

        const existingIds = menuItems
            .map(item => Number(item.id))
            .filter(id => Number.isFinite(id));

        const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        const newItem = {
            id: newId,
            name: itemData.name,
            category: itemData.category,
            price: numericPrice,
            description: itemData.description || { en: "", am: "" },
            icon: itemData.icon || "🍽️",
            image: itemData.image || null,
            preparationTime: Number(itemData.preparationTime) || 10,
            availability: itemData.availability !== undefined ? Boolean(itemData.availability) : true
        };

        menuItems.push(newItem);
        notify("Menu item added successfully!", "success");

        return { success: true, item: newItem };
    } catch (error) {
        console.error("Add menu item error:", error);
        return { success: false, error: "Failed to add menu item" };
    }
}

export async function updateMenuItem(id, updates = {}) {
    try {
        const index = menuItems.findIndex(item => String(item.id) === String(id));

        if (index === -1) {
            return { success: false, error: "Item not found" };
        }

        if (updates.price !== undefined) {
            const numericPrice = Number(updates.price);
            if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
                return { success: false, error: "Price must be a valid positive number" };
            }
            updates.price = numericPrice;
        }

        menuItems[index] = { ...menuItems[index], ...updates };
        notify("Menu item updated successfully!", "success");

        return { success: true, item: menuItems[index] };
    } catch (error) {
        console.error("Update menu item error:", error);
        return { success: false, error: "Failed to update menu item" };
    }
}

export async function deleteMenuItem(id) {
    try {
        const index = menuItems.findIndex(item => String(item.id) === String(id));

        if (index === -1) {
            return { success: false, error: "Item not found" };
        }

        const name = getItemName(menuItems[index]) || "Menu item";
        menuItems.splice(index, 1);
        notify(`"${name}" removed from menu`, "info");

        return { success: true };
    } catch (error) {
        console.error("Delete menu item error:", error);
        return { success: false, error: "Failed to delete menu item" };
    }
}

export async function toggleAvailability(id) {
    try {
        const item = getMenuItemById(id);

        if (!item) {
            return { success: false, error: "Item not found" };
        }

        const newAvailability = !Boolean(item.availability);
        return await updateMenuItem(id, { availability: newAvailability });
    } catch (error) {
        console.error("Toggle availability error:", error);
        return { success: false, error: "Failed to toggle availability" };
    }
}

// ================================================================
// 18. RESET MENU FILTERS
// ================================================================

export function resetMenuFilters() {
    selectedCategory = null;
    searchQuery = "";
    sortBy = "name";
}

// ================================================================
// 19. GET ALL RAW MENU ITEMS
// ================================================================

export function getAllMenuItems() {
    return [...menuItems];
}

// ================================================================
// 20. DOM MENU FILTER + CART LOGIC
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------------
    // CATEGORY FILTER BUTTONS
    // ------------------------------------------------------------
    const filterButtons = document.querySelectorAll(".filter-btn");
    const foodCards = document.querySelectorAll(".food-card");

    if (filterButtons.length === 0) console.warn("No .filter-btn elements found.");
    if (foodCards.length === 0) console.warn("No .food-card elements found.");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const clickedCategory = (button.getAttribute("data-category") || "all").toLowerCase();

            // Update module state safely without shadowing global selectedCategory
            setCategoryFilter(clickedCategory === "all" ? null : clickedCategory);

            // Filter food cards in DOM
            foodCards.forEach(card => {
                const cardCategory = (card.getAttribute("data-category") || "").toLowerCase();

                if (clickedCategory === "all" || cardCategory === clickedCategory || cardCategory.includes(clickedCategory)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // ------------------------------------------------------------
    // ADD TO CART BUTTONS
    // ------------------------------------------------------------
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    if (addToCartButtons.length === 0) console.warn("No .add-to-cart-btn elements found.");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            const btn = event.currentTarget;

            // Try adding by dataset ID
            const menuId = btn.getAttribute("data-id");

            if (menuId !== null && getMenuItemById(menuId)) {
                addToCart(menuId);
                return;
            }

            // Fallback for custom dataset attributes
            const name = btn.getAttribute("data-name") || "Food Item";
            const price = parseFloat(btn.getAttribute("data-price")) || 0;
            const image = btn.getAttribute("data-image") || "";
            const id = menuId || name.toLowerCase().replace(/\s+/g, "-");

            if (price <= 0) {
                notify("Invalid food price.", "error");
                return;
            }

            let cart = getCart();
            const existingItem = cart.find(item => String(item.id) === String(id));

            if (existingItem) {
                existingItem.quantity = Number(existingItem.quantity || 0) + 1;
            } else {
                cart.push({
                    id: String(id),
                    name: name,
                    price: price,
                    quantity: 1,
                    image: image
                });
            }

            saveCart(cart);
            notify(`${name} added to cart!`, "success");
        });
    });

    // Initial cart count render
    updateCartCount();
});
