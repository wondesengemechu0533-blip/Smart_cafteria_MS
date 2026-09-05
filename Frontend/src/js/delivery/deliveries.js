/**
 * Delivery Staff - Active Deliveries (full queue)
 * Shows every delivery order for pickup/out-for-delivery. Delivery staff can
 * begin a delivery only on orders assigned to them (admin assigns).
 * Real-time updates via the 'delivery' socket room.
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
    getMyUserId,
    isAssignedToMe,
    statusClass
} from "./shared.js";

const $ = (id) => document.getElementById(id);

let orders = [];
let stats = null;
let currentFilter = "all";
let myUserId = getMyUserId();

function deliveryCard(order) {
    const n = normalizeStatus(order.status);
    const isReady = n === "ready";
    const isPicked = n === "picked_up";
    const isOut = n === "out_for_delivery";
    const mine = isAssignedToMe(order, myUserId);
    const address = deliveryAddress(order);
    const phone = deliveryPhone(order);

    let actions = "";
    if (isReady && mine) {
        actions = `<button class="btn-action btn-pickup" data-action="pickup" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-box-open"></i> Pick Up
        </button>`;
    } else if (isPicked && mine) {
        actions = `<button class="btn-action btn-go" data-action="out" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-truck-fast"></i> Start Delivery
        </button>`;
    } else if (isOut && mine) {
        actions = `<button class="btn-action btn-done" data-action="delivered" data-order="${esc(order.orderId)}">
            <i class="fa-solid fa-circle-check"></i> Mark Delivered
        </button>`;
    } else if (isReady) {
        actions = `<button class="btn-action btn-disabled" disabled>
            <i class="fa-solid fa-clock"></i> Awaiting Assignment</button>`;
    } else {
        actions = `<button class="btn-action btn-disabled" disabled>${esc(statusLabel(n))}</button>`;
    }

    const assignee = order.deliveryStaffAssigned
        ? `<div style="margin-top:8px;"><small><strong>Assignee:</strong> ${esc(order.deliveryStaffAssigned.name || "Rider")}</small></div>`
        : "";

    return `
        <div class="delivery-card ${isOut ? "out" : isPicked ? "picked" : isReady ? "active" : ""}">
            <div class="d-card-head">
                <h4><i class="fa-solid fa-hashtag"></i> ${esc(order.orderId)}</h4>
                <span class="status-chip ${statusClass(n)}">${esc(statusLabel(n))}</span>
            </div>
            <div class="d-card-body">
                <div><strong>${esc(order.customerName)}</strong> — <a href="tel:${esc(phone)}">${esc(phone || "—")}</a></div>
                <div class="addr"><i class="fa-solid fa-location-dot" style="color:#f97316;"></i> ${esc(address)}
                    ${order.deliveryInfo && order.deliveryInfo.note ? "<br><small><strong>Note:</strong> " + esc(order.deliveryInfo.note) + "</small>" : ""}
                </div>
                ${itemsChips(order.items)}
                ${assignee}
                <div style="margin-top:10px;"><strong>Total: ${money(order.totalAmount)}</strong>
                    <small style="color:#94a3b8;"> (incl. delivery fee ${money(order.deliveryFee)})</small>
                </div>
            </div>
            <div class="d-card-actions">${actions}</div>
        </div>
    `;
}

function matchesFilter(o) {
    const n = normalizeStatus(o.status);
    if (currentFilter === "ready") return n === "ready";
    if (currentFilter === "picked") return n === "picked_up";
    if (currentFilter === "out") return n === "out_for_delivery";
    return true;
}

function render() {
    const list = $("deliveryList");
    const visible = orders.filter(matchesFilter);
    if (!visible.length) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No delivery orders match this view.</p></div>`;
        return;
    }
    list.innerHTML = visible.map(deliveryCard).join("");
}

async function loadQueues() {
    try {
        const data = await api.get("/deliveries");
        orders = data.orders || [];

        const statsData = await api.get("/deliveries/stats");
        stats = (statsData.stats || {});

        $("statReady").textContent = stats.ready || 0;
        $("statOut").textContent = stats.outForDelivery || 0;
        $("statAssignedMe").textContent = orders.filter(o => isAssignedToMe(o, myUserId)).length;

        render();
        hideError();
    } catch (e) {
        showError(e.message || "Failed to load delivery queue.");
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
        loadQueues();
    } catch (e) {
        alert(e.message || "Failed to pick up order.");
    }
}

async function markOutForDelivery(orderId) {
    if (!confirm(`Start delivery for order #${orderId}?`)) return;
    try {
        const res = await api.patch(`/deliveries/${encodeURIComponent(orderId)}/out-for-delivery`, {});
        alert(res.message || "Delivery started.");
        loadQueues();
    } catch (e) {
        alert(e.message || "Failed to start delivery.");
    }
}

async function markDelivered(orderId) {
    if (!confirm(`Confirm order #${orderId} has been delivered to the customer?`)) return;
    try {
        const res = await api.patch(`/deliveries/${encodeURIComponent(orderId)}/delivered`, {});
        alert(res.message || "Order marked as delivered.");
        loadQueues();
    } catch (e) {
        alert(e.message || "Failed to mark delivered.");
    }
}

function bindEvents() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (btn) {
            const orderId = btn.getAttribute("data-order");
            const action = btn.getAttribute("data-action");
            if (action === "pickup") pickUpOrder(orderId);
            else if (action === "out") markOutForDelivery(orderId);
            else if (action === "delivered") markDelivered(orderId);
            return;
        }
        const tab = e.target.closest("[data-filter]");
        if (tab) {
            currentFilter = tab.getAttribute("data-filter");
            document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === tab));
            render();
        }
    });

    $("refreshBtn").addEventListener("click", loadQueues);
}

function setupSocket() {
    const token = localStorage.getItem("auth_token");
    socketClient.on("connect", () => {
        if (socketClient.isDeliveryStaff && socketClient.isDeliveryStaff()) {
            socketClient.socket && socketClient.socket.emit("join:delivery", {});
        }
    });
    ["delivery:assigned", "delivery:new", "order:status", "delivery:out", "delivery:delivered"].forEach((event) => {
        socketClient.on(event, () => loadQueues());
    });
    try {
        socketClient.connect(token);
    } catch (e) {
        console.log("Socket connect skipped:", e?.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    myUserId = getMyUserId();
    bindEvents();
    loadQueues();
    setupSocket();
});