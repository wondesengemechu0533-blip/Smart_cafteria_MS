document.addEventListener("DOMContentLoaded", () => {
    const notificationsContainer = document.getElementById("notifications-container");
    const markAllReadBtn = document.getElementById("mark-all-read-btn");
    const clearAllBtn = document.getElementById("clear-notifications-btn");

    // Load notifications from backend API
    async function getNotifications() {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                renderEmpty("Please log in to view notifications.");
                return [];
            }
            const response = await fetch(window.__API_URL + "/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.notifications) {
                return data.notifications;
            }
            return [];
        } catch (err) {
            console.error("Failed to load notifications:", err);
            renderEmpty("Failed to load notifications.");
            return [];
        }
    }

    function renderEmpty(message) {
        notificationsContainer.innerHTML = `
            <div class="empty-state-card">
                <i class="fa-regular fa-bell-slash empty-icon"></i>
                <h3>No Notifications</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Render notifications
    async function renderNotifications() {
        const list = await getNotifications();

        if (!list || list.length === 0) {
            renderEmpty("You have no recent alerts or order updates right now.");
            return;
        }

        let html = "";
        list.forEach(item => {
            const unreadClass = item.isRead ? "" : "unread";

            // Icon based on notification type
            let iconClass = "fa-bell";
            let iconBg = "icon-system";
            if (item.type === "order" || item.type === "status_update" || item.type === "ready") {
                iconClass = "fa-utensils";
                iconBg = "icon-order";
            } else if (item.type === "promo") {
                iconClass = "fa-tags";
                iconBg = "icon-promo";
            }

            html += `
                <div class="notification-item ${unreadClass}" data-id="${item.id}">
                    <div class="notification-icon ${iconBg}">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div class="notification-body">
                        <div class="notification-title-row">
                            <h4>${item.title}</h4>
                            <span class="notification-time">${item.timeAgo || ''}</span>
                        </div>
                        <p>${item.message}</p>
                    </div>
                    <button class="delete-notif-btn" data-id="${item.id}" title="Remove">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        });

        notificationsContainer.innerHTML = html;
        attachEventListeners();
    }

    // Attach event listeners
    function attachEventListeners() {
        document.querySelectorAll(".notification-item").forEach(item => {
            item.addEventListener("click", (e) => {
                if (e.target.closest(".delete-notif-btn")) return;
                const id = item.getAttribute("data-id");
                markAsRead(id);
            });
        });

        document.querySelectorAll(".delete-notif-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.getAttribute("data-id");
                deleteNotification(id);
            });
        });
    }

    async function markAsRead(id) {
        try {
            const token = localStorage.getItem("auth_token");
            await fetch(window.__API_URL + `/notifications/${id}/read`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            renderNotifications();
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    }

    async function deleteNotification(id) {
        try {
            const token = localStorage.getItem("auth_token");
            await fetch(window.__API_URL + `/notifications/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            renderNotifications();
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    }

    // Mark All as Read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener("click", async () => {
            try {
                const token = localStorage.getItem("auth_token");
                await fetch(window.__API_URL + "/notifications/read-all", {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                });
                renderNotifications();
            } catch (err) {
                console.error("Failed to mark all as read:", err);
            }
        });
    }

    // Clear All - actually delete all notifications
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to clear all notifications?")) {
                try {
                    const token = localStorage.getItem("auth_token");
                    await fetch(window.__API_URL + "/notifications", {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    renderNotifications();
                    // Keep the header/bell unread badge in sync.
                    window.dispatchEvent(new CustomEvent("notification:refresh"));
                    if (typeof window.refreshNotificationBadge === "function") {
                        window.refreshNotificationBadge();
                    }
                } catch (err) {
                    console.error("Failed to clear all notifications:", err);
                }
            }
        });
    }

    // Real-time notification via Socket.IO
    function setupRealtimeListener() {
        const token = localStorage.getItem("auth_token");
        if (!token || typeof io === "undefined") return;

        const socket = io(window.__API_BASE, {
            auth: { token },
            transports: ["websocket", "polling"]
        });

        socket.on("notification:new", (notification) => {
            renderNotifications();
        });
    }

    renderNotifications();
    setupRealtimeListener();
});
