const API_BASE = window.__API_URL;

let allAlerts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadStockAlerts();
    // Refresh every 30 seconds
    setInterval(loadStockAlerts, 30000);
});

async function loadStockAlerts() {
    try {
        const token = localStorage.getItem('auth_token');
        const status = document.getElementById('statusFilter').value;

        let url = `${API_BASE}/kitchen/stock-alerts`;
        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) {
            showNotification('Error loading stock alerts', 'error');
            return;
        }

        allAlerts = data.alerts || [];
        renderAlerts();

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to load stock alerts', 'error');
    }
}

function renderAlerts() {
    const container = document.getElementById('alertsList');
    container.innerHTML = '';

    if (allAlerts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-check"></i></div>
                <p>No stock alerts at the moment</p>
            </div>
        `;
        return;
    }

    allAlerts.forEach(alert => {
        const card = document.createElement('div');
        card.className = `alert-card ${alert.severity}`;

        const createdDate = new Date(alert.createdAt).toLocaleString();

        card.innerHTML = `
            <div class="alert-content">
                <div class="alert-header">
                    <div class="alert-icon">${getSeverityIcon(alert.severity)}</div>
                    <div>
                        <div class="alert-title">${alert.itemName}</div>
                        <span class="severity-badge severity-${alert.severity}">${alert.severity}</span>
                        <span class="status-badge status-${alert.status}">${alert.status}</span>
                    </div>
                </div>

                <div class="alert-details">
                    <div class="detail-item">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">${formatAlertType(alert.alertType)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Reported By</span>
                        <span class="detail-value">${alert.reportedBy || 'System'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Affected Orders</span>
                        <span class="detail-value">${alert.affectedOrders || 0}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Reported At</span>
                        <span class="detail-value">${createdDate}</span>
                    </div>
                </div>

                <div class="alert-reason">
                    <strong>Issue:</strong> ${alert.reason}
                </div>
            </div>

            <div class="alert-actions">
                ${alert.status === 'active' ? `
                    <button class="btn btn-acknowledge" onclick="acknowledgeAlert('${alert.id}')">
                        Mark Acknowledged
                    </button>
                ` : ''}
                ${alert.status !== 'resolved' ? `
                    <button class="btn btn-resolve" onclick="resolveAlert('${alert.id}')">
                        Mark Resolved
                    </button>
                ` : ''}
            </div>
        `;

        container.appendChild(card);
    });
}

function filterAlerts() {
    loadStockAlerts();
}

function getSeverityIcon(severity) {
    switch(severity) {
        case 'critical': return '<i class="fa-solid fa-circle-exclamation" style="color:#dc2626"></i>';
        case 'high': return '<i class="fa-solid fa-circle-exclamation" style="color:#ea580c"></i>';
        case 'medium': return '<i class="fa-solid fa-circle-exclamation" style="color:#eab308"></i>';
        case 'low': return '<i class="fa-solid fa-circle-info" style="color:#2563eb"></i>';
        default: return '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i>';
    }
}

function formatAlertType(type) {
    const types = {
        'out_of_stock': 'Out of Stock',
        'low_stock': 'Low Stock',
        'ingredient_shortage': 'Ingredient Shortage',
        'quality_issue': 'Quality Issue'
    };
    return types[type] || type;
}

function openReportModal() {
    document.getElementById('reportModal').classList.add('active');
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
    document.getElementById('reportForm').reset();
}

document.getElementById('reportForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const alertType = document.getElementById('alertType').value;
    const severity = document.getElementById('severity').value;
    const reason = document.getElementById('reason').value;

    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/stock-alerts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemName: itemName,
                alertType: alertType,
                severity: severity,
                reason: reason
            })
        });

        const data = await response.json();

        if (!data.success) {
            showNotification('Failed to report issue', 'error');
            return;
        }

        showNotification('Stock alert reported successfully', 'success');
        closeReportModal();
        loadStockAlerts();

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to report issue', 'error');
    }
});

async function acknowledgeAlert(alertId) {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/stock-alerts/${alertId}/acknowledge`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) {
            showNotification(data.error || 'Failed to acknowledge alert', 'error');
            return;
        }

        showNotification('Alert acknowledged successfully', 'success');
        loadStockAlerts();

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to acknowledge alert', 'error');
    }
}

async function resolveAlert(alertId) {
    if (!confirm('Mark this alert as resolved?')) return;

    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/stock-alerts/${alertId}/resolve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!data.success) {
            showNotification(data.error || 'Failed to resolve alert', 'error');
            return;
        }

        showNotification('Alert marked as resolved', 'success');
        loadStockAlerts();

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to resolve alert', 'error');
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `alert-notification notification-${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
}
