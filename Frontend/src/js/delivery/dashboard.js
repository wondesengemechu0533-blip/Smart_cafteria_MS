/**
 * Delivery Staff Dashboard
 * - Shows deliveries assigned to the logged-in delivery staff member
 * - Supports: start delivery (out for delivery), mark delivered
 * - Real-time updates via the 'delivery' socket room
 */
import api from "../api.js";
import { socketClient } from "../socket.js";
import {
    normalizeStatus,
    statusLabel,
    money,
    esc,
    itemsChips,
    deliveryAddress,
    deliveryPhone,
    getMyUserId
} from "./shared.js";

const $ = (id) => document.getElementById(id);

let myDeliveries = [];
let myHistory = [];

function deliveryCard(order) {
    const n = normalizeStatus(order.status);
    const isReady = n === "ready";
    const isPicked = n === "picked_up";
    const isOut = n === "out_for_delivery";
    const address = deliveryAddress(order);
    const phone = deliveryPhone(order);

    let actions = "";
    if (isReady) {
        actions = `<button class="btn-action btn-pickup" data-action="pickup" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-box-open"></i> Pick Up
        </button>`;
    } else if (isPicked) {
        actions = `<button class="btn-action btn-go" data-action="out" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-truck-fast"></i> Start Delivery
        </button>`;
    } else if (isOut) {
        actions = `<button class="btn-action btn-done" data-action="delivered" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-circle-check"></i> Mark Delivered
        </button>`;
    } else {
        actions = `<button class="btn-action btn-disabled" disabled>${esc(statusLabel(n))}</button>`;
    }

    const chipClass = statusClass(n);

    return `
        <div class="delivery-card ${isReady ? "active" : isPicked ? "picked" : isOut ? "out" : ""}">
            <div class="d-card-head">
                <h4><i class="fa-solid fa-hashtag"></i> ${esc(order.orderId)}</h4>
                <span class="status-chip ${chipClass}">${esc(statusLabel(n))}</span>
            </div>
            <div class="d-card-body">
                <div><strong>${esc(order.customerName)}</strong> — <a href="tel:${esc(phone)}">${esc(phone || "—")}</a></div>
                <div class="addr"><i class="fa-solid fa-location-dot" style="color:#f97316;"></i> ${esc(address)}
                    ${order.deliveryInfo && order.deliveryInfo.note ? "<br><small><strong>Note:</strong> " + esc(order.deliveryInfo.note) + "</small>" : ""}
                </div>
                ${itemsChips(order.items)}
                <div style="margin-top:10px;"><strong>Total: ${money(order.totalAmount)}</strong>
                    <small style="color:#94a3b8;"> (incl. delivery fee ${money(order.deliveryFee)})</small>
                </div>
            </div>
            <div class="d-card-actions">${actions}</div>
        </div>
    `;
}

function statusClass(n) {
    if (n === "out_for_delivery") return "status-out";
    if (n === "delivered" || n === "completed") return "status-delivered";
    if (n === "picked_up") return "status-picked";
    return "status-ready";
}

function renderActive() {
    const list = $("activeList");
    if (!myDeliveries.length) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No active deliveries assigned to you right now.</p></div>`;
        return;
    }
    list.innerHTML = myDeliveries.map(deliveryCard).join("");
}

function renderHistory() {
    const container = $("historyContainer");
    if (!myHistory.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><p>No delivered orders yet.</p></div>`;
        return;
    }
    const rows = myHistory.map((o) => {
        const when = o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : (o.orderDate || "");
        return `<tr>
            <td><strong>#${esc(o.orderId)}</strong></td>
            <td>${esc(o.customerName)}</td>
            <td>${esc(deliveryAddress(o) || "—")}</td>
            <td>${money(o.totalAmount)}</td>
            <td>${esc(statusLabel(o.status))}</td>
            <td>${esc(when)}</td>
        </tr>`;
    }).join("");
    container.innerHTML = `
        <div class="table-responsive"><table class="history-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Total</th><th>Status</th><th>Delivered</th></tr></thead>
            <tbody>${rows}</tbody>
        </table></div>
    `;
}

async function loadAll() {
    try {
        const active = await api.get("/deliveries/mine");
        myDeliveries = active.orders || [];

        const history = await api.get("/deliveries/my-history");
        myHistory = history.orders || [];

        const stats = await api.get("/deliveries/stats");
        const s = stats.stats || {};
        $("statMyActive").textContent = s.myActive || 0;
        $("statMyOut").textContent = myDeliveries.filter(o => normalizeStatus(o.status) === "out_for_delivery").length;
        $("statMyDelivered").textContent = s.myDelivered || 0;

        renderActive();
        renderHistory();
        hideError();
    } catch (e) {
        showError(e.message || "Failed to load deliveries.");
    }
}

function showError(message) {
    const banner = $("errorBanner");
    if (banner) {
        banner.style.display = "block";
        banner.textContent = "⚠️ " + message;
    }
}

function hideError() {
    const banner = $("errorBanner");
    if (banner) banner.style.display = "none";
}

async function pickUpOrder(orderId) {
    if (!confirm(`Pick up order #${orderId} from the kitchen?`)) return;
    try {
        const res = await api.patch(`/deliveries/${encodeURIComponent(orderId)}/pickup`, {});
        alert(res.message || "Order picked up.");
        loadAll();
    } catch (e) {
        alert(e.message || "Failed to pick up order.");
    }
}

async function markOutForDelivery(orderId) {
    if (!confirm(`Start delivery for order #${orderId}?`)) return;
    try {
        const res = await api.patch(`/deliveries/${encodeURIComponent(orderId)}/out-for-delivery`, {});
        alert(res.message || "Delivery started.");
        loadAll();
    } catch (e) {
        alert(e.message || "Failed to start delivery.");
    }
}

async function markDelivered(orderId) {
    if (!confirm(`Confirm order #${orderId} has been delivered to the customer?`)) return;
    try {
        const res = await api.patch(`/deliveries/${encodeURIComponent(orderId)}/delivered`, {});
        alert(res.message || "Order marked as delivered.");
        loadAll();
    } catch (e) {
        alert(e.message || "Failed to mark delivered.");
    }
}

function bindEvents() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const orderId = btn.getAttribute("data-order");
        const action = btn.getAttribute("data-action");
        if (action === "pickup") pickUpOrder(orderId);
        else if (action === "out") markOutForDelivery(orderId);
        else if (action === "delivered") markDelivered(orderId);
    });

    $("navActive").addEventListener("click", () => {
        $("activeSection").style.display = "block";
        $("historySection").style.display = "none";
        $("navActive").classList.add("active");
        $("navHistory").classList.remove("active");
    });

    $("navHistory").addEventListener("click", () => {
        $("activeSection").style.display = "none";
        $("historySection").style.display = "block";
        $("navHistory").classList.add("active");
        $("navActive").classList.remove("active");
    });

    $("refreshBtn").addEventListener("click", loadAll);
}

function setupSocket() {
    const token = localStorage.getItem("auth_token");

    socketClient.on("connect", () => {
        if (socketClient.isDeliveryStaff && socketClient.isDeliveryStaff()) {
            socketClient.socket && socketClient.socket.emit("join:delivery", {});
        }
    });

    ["delivery:assigned", "order:status", "delivery:new"].forEach((event) => {
        socketClient.on(event, () => loadAll());
    });

    try {
        socketClient.connect(token);
    } catch (e) {
        console.log("Socket connect skipped:", e?.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getMyUserId();
    bindEvents();
    loadAll();
    setupSocket();
});

window.logoutDelivery = function () {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        window.location.href = "../common/login.html";
    }
};