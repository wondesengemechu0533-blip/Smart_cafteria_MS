/**
 * Smart Cafeteria - Delivery Staff Shared Helpers
 * Used by dashboard.js, deliveries.js and history.js
 */

export function normalizeStatus(s) {
    return (s || "").toString().trim().toLowerCase().replace(/\s+/g, "_");
}

export function statusLabel(s) {
    const n = normalizeStatus(s);
    const map = {
        picked_up: "Picked Up",
        ready: "Ready for Delivery",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Completed",
        pending: "Pending",
        preparing: "Preparing",
        cancelled: "Cancelled"
    };
    return map[n] || s || "—";
}

export function statusClass(s) {
    const n = normalizeStatus(s);
    if (n === "out_for_delivery") return "status-out";
    if (n === "delivered" || n === "completed") return "status-delivered";
    if (n === "picked_up") return "status-picked";
    return "status-ready";
}

export function money(v) {
    return Number(v || 0).toFixed(2) + " ETB";
}

export function esc(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
}

export function itemsChips(items) {
    if (!Array.isArray(items) || !items.length) return "";
    const chips = items.slice(0, 6).map((i) =>
        `<span class="item-chip">${esc(i.name || "Item")} x${Number(i.quantity) || 1}</span>`
    );
    return '<div class="items-mini">' + chips.join("") + "</div>";
}

export function deliveryAddress(order) {
    const info = order.deliveryInfo || {};
    return [info.subCity, info.location].filter(Boolean).join(", ") || "—";
}

export function deliveryPhone(order) {
    const info = order.deliveryInfo || {};
    return info.phone || order.customerPhone || "";
}

export function getMyUserId() {
    try {
        const cu = JSON.parse(localStorage.getItem("current_user"));
        if (cu && cu.id) return String(cu.id);
    } catch (e) {}
    try {
        const p = JSON.parse(localStorage.getItem("userProfile"));
        if (p && p.id) return String(p.id);
    } catch (e) {}
    return null;
}

export function isAssignedToMe(order, myUserId) {
    const staff = order.deliveryStaffAssigned;
    const staffId = staff?.id || staff; // handle both object and string
    return Boolean(myUserId && staffId && String(staffId) === String(myUserId));
}

export function orderTimestamp() {
    return new Date().toLocaleTimeString();
}