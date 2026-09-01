const API_BASE = 'http://localhost:5000/api/v1';

let allItems = [];

document.addEventListener('DOMContentLoaded', () => {
    loadMenuAvailability();
});

async function loadMenuAvailability() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/menu-availability`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) {
            showAlert('Error loading menu items', 'error');
            return;
        }

        allItems = data.items || [];
        renderItems(allItems);

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to load menu items', 'error');
    }
}

function renderItems(items) {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No items found</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-card ${!item.isAvailable ? 'unavailable' : ''}`;

        const lastUpdate = item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString() : 'Never';

        card.innerHTML = `
            <div class="item-header">
                <div class="item-name">${item.name.en || item.name}</div>
                <span class="availability-badge ${item.isAvailable ? 'badge-available' : 'badge-unavailable'}">
                    ${item.isAvailable ? '<i class="fa-solid fa-check"></i> Available' : '<i class="fa-solid fa-xmark"></i> Unavailable'}
                </span>
            </div>

            <div class="item-details">
                <div class="detail-item">
                    <span class="detail-label">Category</span>
                    <span class="detail-value">${item.category}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">Br ${item.price}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prep Time</span>
                    <span class="detail-value">${item.preparationTime} mins</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Updated</span>
                    <span class="detail-value">${lastUpdate}</span>
                </div>
            </div>

            ${item.outOfStockReason ? `
                <div class="unavailable-reason">
                    <strong>Reason:</strong> ${item.outOfStockReason}
                </div>
            ` : ''}

            <div class="action-buttons">
                ${item.isAvailable ? `
                    <button class="btn btn-mark-unavailable" onclick="openUnavailableModal('${item.id}')">
                        Mark Unavailable
                    </button>
                ` : `
                    <button class="btn btn-mark-available" onclick="markAvailable('${item.id}')">
                        Mark Available
                    </button>
                `}
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterItems() {
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = allItems;

    if (category) {
        filtered = filtered.filter(item => item.category === category);
    }

    if (status === 'available') {
        filtered = filtered.filter(item => item.isAvailable);
    } else if (status === 'unavailable') {
        filtered = filtered.filter(item => !item.isAvailable);
    }

    renderItems(filtered);
}

function openUnavailableModal(itemId) {
    document.getElementById('itemIdForModal').value = itemId;
    document.getElementById('unavailableModal').classList.add('active');
}

function closeUnavailableModal() {
    document.getElementById('unavailableModal').classList.remove('active');
    document.getElementById('unavailableForm').reset();
}

document.getElementById('unavailableForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemId = document.getElementById('itemIdForModal').value;
    const reason = document.getElementById('unavailableReason').value;

    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/menu/${itemId}/availability`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isAvailable: false,
                reason: reason
            })
        });

        const data = await response.json();

        if (!data.success) {
            showAlert('Failed to update availability', 'error');
            return;
        }

        showAlert('Item marked as unavailable and customers notified', 'success');
        closeUnavailableModal();
        loadMenuAvailability();

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to update availability', 'error');
    }
});

async function markAvailable(itemId) {
    if (!confirm('Mark this item as available?')) return;

    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/kitchen/menu/${itemId}/availability`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isAvailable: true
            })
        });

        const data = await response.json();

        if (!data.success) {
            showAlert('Failed to update availability', 'error');
            return;
        }

        showAlert('Item marked as available', 'success');
        loadMenuAvailability();

    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to update availability', 'error');
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);

    setTimeout(() => alert.remove(), 4000);
}
