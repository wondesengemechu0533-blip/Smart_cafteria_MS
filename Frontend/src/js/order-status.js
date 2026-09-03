/**
 * Live Order Tracker
 * - Renders the order receipt + status timeline
 * - Fetches LIVE status from the backend (GET /api/orders/:orderId)
 * - Joins the Socket.io order room and updates the timeline in real-time
 *   when the kitchen marks the order preparing/ready/served
 * - Persists status changes back to localStorage for consistency on refresh
 */
import api from "./api.js";
import { socketClient } from "./socket.js";

/**
 * Find an order by its ID from localStorage (orderHistory / latestOrder)
 * @param {string} orderId - Order ID (may include a leading #)
 * @returns {Object|null} Order object or null
 */
export function getOrderById(orderId) {
    if (!orderId) return null;
    const normalized = String(orderId).replace(/^#/, "");

    const historyData = JSON.parse(localStorage.getItem("orderHistory")) || [];
    let found = historyData.find(o => (o.orderId || o.id || "").replace(/^#/, "") === normalized);
    if (found) {
        return found;
    }

    const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (latestOrder) {
        const latestId = (latestOrder.orderId || latestOrder.id || "").replace(/^#/, "");
        if (latestId === normalized) {
            return latestOrder;
        }
    }

    return null;
}

/**
 * Attached to window object for live cancellation from status receipt page.
 * Submits a real backend cancellation request (re-used for safety if wired up).
 */
window.cancelOrderFromStatusPage = async function(orderId) {
    if (!confirm(`Are you sure you want to cancel order #${orderId}?`)) {
        return;
    }

    try {
        const { requestCancellation } = await import("./order-cancellation.js");
        const result = await requestCancellation(orderId, "CUSTOMER_CHANGED_MIND", "Cancelled by customer from tracker");

        if (!result || result.success !== true) {
            alert((result && result.error) || "Cancellation request could not be submitted.");
            return;
        }

        let latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
        let historyData = JSON.parse(localStorage.getItem("orderHistory")) || [];

        // 1. Update latest order if ID matches
        if (latestOrder) {
            const latestId = latestOrder.orderId || latestOrder.id;
            if (!latestId || String(latestId) === String(orderId)) {
                latestOrder.status = "Cancelled";
                localStorage.setItem("latestOrder", JSON.stringify(latestOrder));
            }
        }

        // 2. Update history array
        historyData = historyData.map(order => {
            const id = order.orderId || order.id;
            if (String(id) === String(orderId)) {
                order.status = "Cancelled";
            }
            return order;
        });

        localStorage.setItem("orderHistory", JSON.stringify(historyData));
        alert("Cancellation request submitted successfully. It will be reviewed by an administrator.");
        location.reload();
    } catch (error) {
        alert(error.message || "Failed to submit the cancellation request.");
    }
};

function normalizeStatus(status) {
    return (status || "").toString().trim().toLowerCase();
}

/**
 * Persist a status update back into localStorage so a refresh shows the truth.
 */
function persistStatus(orderId, status) {
    const id = String(orderId).replace(/^#/, "");
    let historyData = JSON.parse(localStorage.getItem("orderHistory")) || [];
    let changed = false;

    historyData = historyData.map(order => {
        if ((order.orderId || order.id || "").replace(/^#/, "") === id) {
            if (normalizeStatus(order.status) !== normalizeStatus(status)) {
                order.status = status;
                changed = true;
            }
        }
        return order;
    });

    const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (latestOrder) {
        const latestId = (latestOrder.orderId || latestOrder.id || "").replace(/^#/, "");
        if (latestId === id && normalizeStatus(latestOrder.status) !== normalizeStatus(status)) {
            latestOrder.status = status;
            changed = true;
        }
    }

    if (changed) {
        localStorage.setItem("orderHistory", JSON.stringify(historyData));
        localStorage.setItem("latestOrder", JSON.stringify(latestOrder));
    }
}

/**
 * Update the status heading/badge/subtext based on the order status.
 */
function setStatusText(status) {
    const s = normalizeStatus(status);
    const heading = document.getElementById("status-heading");
    const subtext = document.getElementById("status-subtext");
    const icon = document.getElementById("status-badge-icon");
    if (!heading && !subtext) return;

    const map = {
        pending: ["Order Received", "We have sent your order directly to the kitchen counter."],
        preparing: ["Preparing", "The kitchen is preparing your order. Please wait."],
        ready: ["Ready for Pickup", "Your order is ready for pickup!"],
        served: ["Served", "Your order has been served."],
        completed: ["Completed", "Your order has been completed."],
        cancelled: ["Order Cancelled", "This order was cancelled and will not be prepared."]
    };

    const entry = map[s] || ["Order Tracker", "We are processing your order."];

    if (heading) heading.textContent = entry[0];
    if (subtext) subtext.textContent = entry[1];

    if (icon) {
        const icons = {
            pending: 'fa-circle-check',
            preparing: 'fa-fire-burner',
            ready: 'fa-bell-concierge',
            served: 'fa-circle-check',
            completed: 'fa-circle-check',
            cancelled: 'fa-circle-xmark'
        };
        const colors = {
            pending: '#16a34a',
            preparing: '#16a34a',
            ready: '#16a34a',
            served: '#16a34a',
            completed: '#16a34a',
            cancelled: '#dc3545'
        };
        icon.innerHTML = `<i class="fa-solid ${icons[s] || 'fa-circle-check'}" style="color: ${colors[s] || '#ff6b00'}; font-size: 2.5rem;"></i>`;
    }

    // Gate the cancel button (hide actions for terminal statuses)
    updateCancelButton(s);
}

function updateCancelButton(s) {
    const cancelWrapper = document.getElementById("cancel-btn-wrapper");
    if (!cancelWrapper) return;
    const timelineSection = document.getElementById("timeline-section");

    if (s === "cancelled") {
        if (timelineSection) {
            timelineSection.style.opacity = "0.4";
            timelineSection.style.pointerEvents = "none";
        }
        cancelWrapper.innerHTML = `
            <button class="btn btn-outline-danger" disabled style="width: 100%; color: #dc3545; border: 1px solid #dc3545; padding: 10px; border-radius: 6px; background: #fde8e8; cursor: not-allowed;">
                <i class="fa-solid fa-ban"></i> Cancelled
            </button>
        `;
    } else if (s !== "completed" && s !== "served") {
        // Active, non-terminal order → allow cancellation request.
        // NOTE: "ready" is intentionally cancellable here to match the
        // backend requestCancellation guard (which only blocks CANCELLED /
        // COMPLETED / SERVED) and the cancel-order.html page, so the button
        // is never shown disabled for an order that can actually be cancelled.
        const url = new URL(window.location.href);
        const id = url.searchParams.get("orderId") || url.searchParams.get("id");
        cancelWrapper.innerHTML = `
            <a href="cancel-order.html?id=${encodeURIComponent(id || "")}"
                class="btn btn-outline-danger"
                style="width: 100%; display: inline-block; text-align: center; color: #dc3545; border: 1px solid #dc3545; padding: 10px; border-radius: 6px; background: transparent; cursor: pointer; font-weight: 600; text-decoration: none; box-sizing: border-box;">
                <i class="fa-solid fa-ban"></i> Cancel Order
            </a>
        `;
    } else {
        cancelWrapper.innerHTML = `
            <button class="btn btn-success" disabled style="width: 100%; color: #155724; border: 1px solid #c3e6cb; padding: 10px; border-radius: 6px; background: #d4edda; cursor: not-allowed;">
                <i class="fa-solid fa-circle-check"></i> ${statusLabel(s)}
            </button>
        `;
    }
}

function statusLabel(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Mark the correct timeline steps/lines active based on the order status.
 */
function renderTimeline(status) {
    const s = normalizeStatus(status);
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    const line1 = document.getElementById("line-1");
    const line2 = document.getElementById("line-2");

    if (!step1 || !step2 || !step3) return;

    // Reset every step & line to its neutral/empty state first.
    const reset = () => [step1, step2, step3, line1, line2].forEach(el => {
        if (el) {
            el.classList.remove("active");
            el.style.opacity = "1";
        }
    });

    // Highlight ONLY the single step that matches the current status. Every
    // other step stays empty. The incoming connecting line matches that step.
    if (s === "cancelled") {
        reset();
        step1.classList.add("active");
        return;
    }

    let activeStep = null;
    let activeLine = null;
    if (s === "pending") {
        activeStep = step1;
    } else if (s === "preparing" || s === "in progress") {
        activeStep = step2;
        activeLine = line1;
    } else if (s === "ready" || s === "served" || s === "completed") {
        activeStep = step3;
        activeLine = line2;
    }

    reset();
    if (activeStep) activeStep.classList.add("active");
    if (activeLine) activeLine.classList.add("active");
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

function populateReceipt(orderData) {
    const currentId = orderData.orderId || orderData.id || "ET-0000";
    if (document.getElementById("display-order-id")) document.getElementById("display-order-id").textContent = `#${currentId}`;
    if (document.getElementById("receipt-name")) document.getElementById("receipt-name").textContent = orderData.customerName || orderData.name || "Customer";
    if (document.getElementById("receipt-phone")) document.getElementById("receipt-phone").textContent = orderData.customerPhone || orderData.phone || "-";
    if (document.getElementById("receipt-dining-type")) document.getElementById("receipt-dining-type").textContent = orderData.orderType === "dine-in" ? "Dine-In" : "Takeaway";
    if (document.getElementById("receipt-table")) document.getElementById("receipt-table").textContent = orderData.tableNumber || orderData.table || "-";
    if (document.getElementById("receipt-payment")) document.getElementById("receipt-payment").textContent = orderData.paymentMethod || "Telebirr";
    if (document.getElementById("receipt-time")) document.getElementById("receipt-time").textContent = orderData.orderDate || new Date().toLocaleString();

    // Items
    const itemsListContainer = document.getElementById("receipt-items-list");
    if (itemsListContainer && Array.isArray(orderData.items)) {
        let itemsHTML = "";
        orderData.items.forEach((item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity) || 1;
            const itemTotal = (price * qty).toFixed(0);
            itemsHTML += `
                <div class="receipt-item-row" style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <div>
                        <span class="qty-badge" style="font-weight: bold; color: #ff6b00; margin-right: 6px;">${qty}x</span>
                        <span class="item-title">${escapeHtml(item.name)}</span>
                    </div>
                    <span class="item-price">${itemTotal} ETB</span>
                </div>
            `;
        });
        itemsListContainer.innerHTML = itemsHTML;
    }

    // Totals
    const subtotalVal = parseFloat(orderData.subtotal) || parseFloat(orderData.totalAmount) || 0;
    const serviceFeeVal = parseFloat(orderData.serviceFee) || 20;
    const totalVal = parseFloat(orderData.totalAmount) || (subtotalVal + serviceFeeVal);

    if (document.getElementById("receipt-subtotal")) document.getElementById("receipt-subtotal").textContent = subtotalVal.toFixed(0);
    if (document.getElementById("receipt-service-fee")) document.getElementById("receipt-service-fee").textContent = serviceFeeVal.toFixed(0);
    if (document.getElementById("receipt-total")) document.getElementById("receipt-total").textContent = totalVal.toFixed(0);
}

function renderEmptyState() {
    const mainContent = document.querySelector("main");
    if (mainContent) {
        mainContent.innerHTML = `
            <section class="status-banner" style="max-width: 500px; margin: 40px auto; text-align: center; background: #fff; padding: 30px; border-radius: 10px;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #ff6b00; margin-bottom: 12px;"></i>
                <h2>No Active Order Found</h2>
                <p style="color: #6b7280; margin-bottom: 16px;">You don't have an active order tracking session right now.</p>
                <a href="menu.html" class="btn btn-primary" style="display: inline-block; padding: 10px 20px; background: #ff6b00; color: #fff; border-radius: 6px; text-decoration: none;">View Menu</a>
            </section>
        `;
    }
}

function renderOrder(orderData) {
    populateReceipt(orderData);
    const status = orderData.status || "Pending";
    renderTimeline(status);
    setStatusText(status);
}

async function loadLiveOrder(orderId, fallbackOrderData) {
    // If customer is logged in, fetch the authoritative live status.
    const token = localStorage.getItem("auth_token");
    if (token && orderId) {
        try {
            const live = await fetchLiveStatus(orderId);
            if (live && live.status) {
                const merged = { ...(fallbackOrderData || {}), ...live };
                renderOrder(merged);
                persistStatus(orderId, live.status);
                return merged;
            }
        } catch (err) {
            // Fall back to local data if the fetch fails (e.g. not logged in / offline).
            console.log("Could not fetch live order (using local data):", err?.message);
        }
    }
    if (fallbackOrderData) {
        renderOrder(fallbackOrderData);
    }
    return fallbackOrderData;
}

/**
 * Fetch only the live status for an order from the backend.
 * Returns the order object (or null) without touching the UI, so it can be
 * used both for the initial render and for background polling.
 */
async function fetchLiveStatus(orderId) {
    const token = localStorage.getItem("auth_token");
    if (!token || !orderId) return null;
    const res = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return res?.data?.order || res?.order || null;
}

function setupRealtime(orderId) {
    const token = localStorage.getItem("auth_token");
    if (!token || !orderId) return;

    socketClient.on("order:status", (order) => {
        const liveId = (order?.orderId || order?.id || "").replace(/^#/, "");
        const currentId = String(orderId).replace(/^#/, "");
        if (liveId && currentId && liveId !== currentId) return; // not our order

        const newStatus = order?.status;
        if (!newStatus) return;

        renderTimeline(newStatus);
        setStatusText(newStatus);
        persistStatus(currentId, newStatus);
        // NOTE: a toast/popup is handled by customer-realtime.js via the
        // "notification:new" socket event, so we do NOT duplicate it here.
    });

    // Fallback: poll the backend periodically so the timeline advances even if
    // the socket is unreachable/disconnected. Stop once the order is terminal.
    startStatusPolling(orderId);

    // Join this order's room on the socket server (guarantees targeted events)
    socketClient.on("connect", () => {
        socketClient.joinOrderRoom(orderId);
    });
    // Try to connect / join immediately.
    try {
        socketClient.connect(token);
        socketClient.joinOrderRoom(orderId);
    } catch (e) {
        console.log("Socket connect skipped:", e?.message);
    }
}

let statusPollTimer = null;

/**
 * Poll the backend for the live order status every few seconds and advance the
 * timeline (received -> preparing -> ready) as the kitchen updates it. This is
 * a reliability fallback for the socket: even if realtime fails, the tracker
 * still reflects the kitchen's actions. Polling stops once the order reaches a
 * terminal state (ready/served/completed/cancelled).
 */
function startStatusPolling(orderId) {
    if (!orderId) return;
    try { clearInterval(statusPollTimer); } catch (e) {}
    statusPollTimer = setInterval(async () => {
        try {
            const live = await fetchLiveStatus(orderId);
            if (!live || !live.status) return;
            const s = normalizeStatus(live.status);
            // Only update the timeline + heading; avoid re-rendering the whole
            // receipt on every poll to not disrupt the page.
            renderTimeline(s);
            setStatusText(s);
            persistStatus(orderId, live.status);
            if (s === "ready" || s === "served" || s === "completed" || s === "cancelled") {
                try { clearInterval(statusPollTimer); statusPollTimer = null; } catch (e) {}
            }
        } catch (err) {
            // Backend unreachable or not logged in; keep local state as-is.
        }
    }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedId = urlParams.get("orderId") || urlParams.get("id") || urlParams.get("ticket");

    function bootstrap() {
        let orderData = null;
        let historyData = JSON.parse(localStorage.getItem("orderHistory")) || [];
        let latestOrder = JSON.parse(localStorage.getItem("latestOrder"));

        if (requestedId) {
            orderData = historyData.find(o => (o.orderId || o.id) === requestedId);
        }

        if (!orderData) {
            orderData = latestOrder;
        }

        if (!orderData && !requestedId) {
            renderEmptyState();
            return;
        }

        // Resolve the authoritative orderId (local ticket number e.g. "ET-1234")
        const orderId = orderData?.orderId || orderData?.id || requestedId;

        // Dashboards may pass an id that includes a leading # - normalize for API call
        const normalizedId = String(orderId || "").replace(/^#/, "");

        // Kick off live status fetch + socket subscription.
        loadLiveOrder(normalizedId, orderData);
        setupRealtime(normalizedId);
    }

    bootstrap();

    // A customer who just logged in may not have localStorage order data yet
    // (customer-orders-sync.js rebuilds it asynchronously from the backend).
    // Re-check once the sync completes so the tracking page populates.
    if (!requestedId) {
        const onSynced = () => {
            if (JSON.parse(localStorage.getItem("latestOrder"))) {
                window.removeEventListener("customer:orders-synced", onSynced);
                bootstrap();
            }
        };
        window.addEventListener("customer:orders-synced", onSynced);
        // Safety net: also re-check after a short delay in case the event missed.
        setTimeout(onSynced, 2000);
    }
});
