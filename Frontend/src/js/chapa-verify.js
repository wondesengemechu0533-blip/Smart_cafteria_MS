/**
 * Smart Cafeteria Ordering System
 * File: Frontend/src/js/chapa-verify.js
 *
 * Verifies a pending Chapa payment after the customer returns from
 * Chapa's hosted checkout page. Because Chapa's callback cannot reach
 * a localhost backend, the frontend actively calls the backend's
 * GET /payments/chapa/verify/:txRef endpoint (which in turn queries
 * Chapa's API) to confirm payment and mark the order as paid.
 */

import api from "./api.js";

const PENDING_KEY = "chapa_pending_payment";

function getPendingPayment() {
    try {
        const raw = localStorage.getItem(PENDING_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && parsed.txRef ? parsed : null;
    } catch (e) {
        console.warn("Could not read pending Chapa payment:", e);
        return null;
    }
}

function clearPendingPayment() {
    try {
        localStorage.removeItem(PENDING_KEY);
    } catch (e) {
        console.warn("Could not clear pending Chapa payment:", e);
    }
}

function persistOrder(order) {
    try {
        localStorage.setItem("latestOrder", JSON.stringify(order));
        let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
        const id = order.orderId || order.id;
        let exists = false;
        history = history.map((o) => {
            if ((o.orderId || o.id) === id) {
                exists = true;
                return order;
            }
            return o;
        });
        if (!exists) {
            history.unshift(order);
        }
        localStorage.setItem("orderHistory", JSON.stringify(history));
    } catch (e) {
        console.warn("Could not persist order after payment:", e);
    }
}

function showSuccessBanner(transactionId, amount) {
    const banner = document.getElementById("payment-success-banner");
    if (!banner) return;

    const tx = transactionId ? `Transaction: <strong>${transactionId}</strong>` : "";
    const amt = amount ? `Amount: <strong>${amount} ETB</strong>` : "";

    banner.classList.remove("hidden");
    banner.innerHTML = `
        <div style="background:#d1fae5;border:1px solid #6ee7b7;color:#065f46;padding:16px 18px;border-radius:10px;display:flex;align-items:center;gap:14px;margin:16px 0;">
            <i class="fa-solid fa-circle-check" style="font-size:2rem;"></i>
            <div>
                <strong style="font-size:1.05rem;">Payment Successful</strong>
                <div style="margin-top:2px;font-size:0.9rem;">
                    Your Chapa (test) payment has been confirmed.
                    ${tx} ${amt}
                </div>
                <div style="margin-top:4px;font-size:0.85rem;opacity:.9;">
                    A receipt for your order is shown below.
                </div>
            </div>
        </div>
    `;
}

async function verifyChapaPayment() {
    const pageOrderId = new URLSearchParams(window.location.search).get("orderId");
    const pending = getPendingPayment();

    // Only verify when this page is for the order that has a pending Chapa payment.
    if (!pending) return;
    if (!pageOrderId || pageOrderId !== pending.orderId) return;

    const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
    const orderToUpdate = latestOrder;

    try {
        // Sync/verify payment status with the backend (which queries Chapa).
        const result = await api.get(`/payments/chapa/verify/${encodeURIComponent(pending.txRef)}`);
        const payment = result.payment || result.data?.payment || (result.success && result) || null;
        const isPaid = result.success === true ||
            payment?.status === "PAID" ||
            (payment && payment.status === "PAID");

        if (isPaid) {
            const transactionId = payment?.transactionId || payment?.providerReference || pending.txRef;
            const amount = payment?.amount || orderToUpdate?.totalAmount;

            if (orderToUpdate) {
                orderToUpdate.paymentStatus = "PAID";
                orderToUpdate.transactionId = transactionId;
                if (
                    orderToUpdate.status &&
                    orderToUpdate.status.toLowerCase() !== "completed" &&
                    orderToUpdate.status.toLowerCase() !== "ready"
                ) {
                    // Keep it simple: a paid Chapa order is ready/completed from a
                    // payment perspective; the kitchen still controls the actual
                    // status, so we do not force "completed" here.
                }
                persistOrder(orderToUpdate);
            }

            showSuccessBanner(transactionId, amount);
        } else {
            // Payment still pending/failed on Chapa's side.
            console.warn("Chapa payment not yet confirmed:", result);
        }
    } catch (error) {
        console.error("Chapa verification failed:", error);
        // Verification may fail if Chapa is unreachable; keep the pending
        // payment so a later refresh retries automatically.
        return;
    }

    // Only clear the pending record once it is confirmed paid.
    const confirmed = latestOrder && latestOrder.paymentStatus === "PAID";
    if (confirmed) {
        clearPendingPayment();
    }
}

document.addEventListener("DOMContentLoaded", verifyChapaPayment);
