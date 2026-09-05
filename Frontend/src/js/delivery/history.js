/**
 * Delivery Staff - My History
 * Shows completed/history of the delivery staff member's own deliveries
 * plus summary stats from /deliveries/stats and /deliveries/my-history.
 */
import api from "../api.js";
import { socketClient } from "../socket.js";
import {
    statusLabel,
    money,
    esc,
    deliveryAddress,
    getMyUserId
} from "./shared.js";

const $ = (id) => document.getElementById(id);

let history = [];
let myUserId = getMyUserId();

function render() {
    const container = $("historyContainer");
    if (!history.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><p>No delivered orders yet.</p></div>`;
        return;
    }
    const rows = history.map((o) => {
        const when = o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : (o.orderDate || "");
        return `<tr>
            <td><strong>#${esc(o.orderId)}</strong></td>
            <td>${esc(o.customerName)}</td>
            <td>${esc(deliveryAddress(o))}</td>
            <td>${esc(statusLabel(o.status))}</td>
            <td>${money(o.totalAmount)}</td>
            <td>${esc(when)}</td>
        </tr>`;
    }).join("");
    container.innerHTML = `
        <div class="table-responsive"><table class="history-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Status</th><th>Total</th><th>Completed</th></tr></thead>
            <tbody>${rows}</tbody>
        </table></div>
    `;
}

async function loadHistory() {
    try {
        const data = await api.get("/deliveries/my-history");
        history = data.orders || [];

        const statsData = await api.get("/deliveries/stats");
        const s = statsData.stats || {};

        $("statTotal").textContent = s.myDelivered || history.length || 0;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const deliveredToday = history.filter((o) => {
            const d = o.deliveredAt ? new Date(o.deliveredAt) : null;
            return d && d >= todayStart;
        });
        $("statToday").textContent = deliveredToday.length;

        const totalCollected = history.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        $("statCollected").textContent = money(totalCollected);

        render();
        hideError();
    } catch (e) {
        showError(e.message || "Failed to load history.");
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

function bindEvents() {
    $("refreshBtn").addEventListener("click", loadHistory);
}

function setupSocket() {
    const token = localStorage.getItem("auth_token");
    socketClient.on("connect", () => {
        if (socketClient.isDeliveryStaff && socketClient.isDeliveryStaff()) {
            socketClient.socket && socketClient.socket.emit("join:delivery", {});
        }
    });
    ["delivery:delivered", "order:status"].forEach((event) => {
        socketClient.on(event, () => loadHistory());
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
    loadHistory();
    setupSocket();
});