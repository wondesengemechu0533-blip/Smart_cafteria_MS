import api from '../../js/api.js';

let allNotifications = [];
let currentFilter = 'all';
let pollInterval = null;

const notifList = document.getElementById('notifList');
const emptyState = document.getElementById('emptyState');
const markAllBtn = document.getElementById('markAllBtn');
const sidebarBadge = document.getElementById('sidebarNotifBadge');
const toastEl = document.getElementById('toast');

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function getTypeInfo(type) {
    const map = {
        order: { icon: 'fa-receipt', cls: 'order' },
        preparation: { icon: 'fa-fire-burner', cls: 'preparation' },
        stock: { icon: 'fa-triangle-exclamation', cls: 'stock' },
        system: { icon: 'fa-cog', cls: 'system' },
    };
    return map[type] || { icon: 'fa-info-circle', cls: 'general' };
}

function timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    return days + 'd ago';
}

function renderNotifications() {
    let filtered = allNotifications;
    if (currentFilter === 'unread') {
        filtered = allNotifications.filter(n => !n.read);
    }

    if (filtered.length === 0) {
        notifList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    notifList.innerHTML = filtered.map(n => {
        const info = getTypeInfo(n.type);
        const readCls = n.read ? '' : ' unread';
        const badgeCls = n.read ? 'read' : 'unread';
        const badgeText = n.read ? 'Read' : 'Unread';
        return `
            <div class="notif-card${readCls}" data-id="${n._id}" onclick="window.handleNotifClick('${n._id}', event)">
                <div class="notif-icon ${info.cls}">
                    <i class="fa-solid ${info.icon}"></i>
                </div>
                <div class="notif-body">
                    <div class="notif-title">${escapeHtml(n.title)}</div>
                    <div class="notif-message">${escapeHtml(n.message)}</div>
                    <div class="notif-meta">
                        <span class="notif-time">${timeAgo(n.createdAt)}</span>
                        <span class="notif-badge ${badgeCls}">${badgeText}</span>
                    </div>
                </div>
                <button class="notif-delete" onclick="window.handleDeleteNotif('${n._id}', event)" title="Delete">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

async function fetchNotifications() {
    try {
        const data = await api.get('/notifications');
        if (data.success) {
            allNotifications = data.notifications || [];
            renderNotifications();
            updateBadge();
        }
    } catch (err) {
        console.error('Failed to load notifications:', err);
    }
}

async function updateBadge() {
    try {
        const data = await api.get('/notifications/unread');
        if (data.success) {
            const count = data.count || 0;
            if (count > 0) {
                sidebarBadge.textContent = count > 99 ? '99+' : count;
                sidebarBadge.style.display = 'inline';
            } else {
                sidebarBadge.style.display = 'none';
            }
        }
    } catch (err) {
        console.error('Failed to fetch unread count:', err);
    }
}

window.handleNotifClick = async function (id, event) {
    if (event.target.closest('.notif-delete')) return;
    const notif = allNotifications.find(n => n._id === id);
    if (notif && !notif.read) {
        try {
            await api.patch(`/notifications/${id}/read`);
            notif.read = true;
            renderNotifications();
            updateBadge();
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    }
};

window.handleDeleteNotif = async function (id, event) {
    event.stopPropagation();
    try {
        await api.delete(`/notifications/${id}`);
        allNotifications = allNotifications.filter(n => n._id !== id);
        renderNotifications();
        updateBadge();
        showToast('Notification deleted');
    } catch (err) {
        console.error('Failed to delete notification:', err);
    }
};

window.markAllRead = async function () {
    try {
        await api.patch('/notifications/read-all');
        allNotifications.forEach(n => n.read = true);
        renderNotifications();
        updateBadge();
        showToast('All notifications marked as read');
    } catch (err) {
        console.error('Failed to mark all read:', err);
    }
};

window.setFilter = function (filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderNotifications();
};

fetchNotifications();
updateBadge();
pollInterval = setInterval(() => {
    fetchNotifications();
    updateBadge();
}, 30000);
