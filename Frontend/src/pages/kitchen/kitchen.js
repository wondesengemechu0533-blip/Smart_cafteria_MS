/**
 * Kitchen Display System (KDS) Module
 * Features: Real-time Socket.io updates, Status Filters, State Progression, Dynamic Elapsed Time
 */

import { socketClient } from "../../js/socket.js";
import api from "../../js/api.js";

document.addEventListener('DOMContentLoaded', () => {
    KDS.init();
});

const KDS = {
    orders: new Map(), // orderId -> order object
    currentFilter: 'all',
    gridContainer: null,
    pendingCountEl: null,
    preparingCountEl: null,
    readyCountEl: null,
    updateInterval: null,

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadInitialOrders();
        this.setupSocketListeners();
        this.startTimer();
        this.render();
    },

    cacheDOM() {
        this.gridContainer = document.getElementById('kitchenTicketsGrid');
        this.tableBody = document.getElementById('kitchenOrdersBody');
        this.pendingCountEl = document.getElementById('pendingCount');
        this.preparingCountEl = document.getElementById('preparingCount');
        this.readyCountEl = document.getElementById('readyCount');
    },

    bindEvents() {
        const filterButtons = document.querySelectorAll('.filter-group .btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.status || 'all';
                this.render();
            });
        });
    },

    async loadInitialOrders() {
        try {
            const response = await api.get('/kitchen/dashboard');
            if (response.success) {
                // Combine all orders from different statuses
                const allOrders = [
                    ...(response.orders.pending || []),
                    ...(response.orders.preparing || []),
                    ...(response.orders.ready || [])
                ];
                allOrders.forEach(order => {
                    this.orders.set(order.orderId, order);
                });
                this.updateStats();
            }
        } catch (error) {
            console.error('Failed to load initial orders:', error);
        }
    },

    setupSocketListeners() {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.warn('No auth token found, skipping socket connection');
            return;
        }

        socketClient.connect(token);

        socketClient.on('order:new', (order) => this.handleNewOrder(order));
        socketClient.on('order:status', (order) => this.handleStatusUpdate(order));
        socketClient.on('order:payment', (order) => this.handlePaymentComplete(order));
    },

    handleNewOrder(order) {
        console.log('New order received:', order);
        this.orders.set(order.orderId, order);
        this.playNotificationSound();
        this.updateStats();
        this.render();
    },

    handleStatusUpdate(order) {
        console.log('Order status update:', order);
        this.orders.set(order.orderId, order);
        this.updateStats();
        this.render();
    },

    handlePaymentComplete(order) {
        console.log('Payment completed for order:', order);
        this.orders.set(order.orderId, order);
        this.updateStats();
        this.render();
    },

    updateStats() {
        let pending = 0, preparing = 0, ready = 0;
        
        this.orders.forEach(order => {
            const status = order.status?.toLowerCase();
            if (status === 'pending') pending++;
            else if (status === 'preparing') preparing++;
            else if (status === 'ready') ready++;
        });

        if (this.pendingCountEl) this.pendingCountEl.textContent = pending;
        if (this.preparingCountEl) this.preparingCountEl.textContent = preparing;
        if (this.readyCountEl) this.readyCountEl.textContent = ready;
    },

    getFilteredOrders() {
        const orders = Array.from(this.orders.values());
        if (!this.currentFilter || this.currentFilter.toLowerCase() === 'all') {
            return orders.filter(o => o.status !== 'served' && o.status !== 'cancelled');
        }
        return orders.filter(o => 
            o.status?.toLowerCase() === this.currentFilter.toLowerCase()
        );
    },

    getElapsedTime(createdAt) {
        if (!createdAt) return '00 mins';
        const diffMs = new Date() - new Date(createdAt);
        const diffMins = Math.floor(diffMs / 60000);
        return `${String(diffMins).padStart(2, '0')} mins`;
    },

    async updateOrderStatus(orderId, newStatus) {
        try {
            const endpoint = newStatus === 'preparing' ? 'accept' : 
                            newStatus === 'ready' ? 'ready' : 
                            newStatus === 'served' ? 'serve' : null;
            
            if (!endpoint) return;

            const response = await api.patch(`/kitchen/orders/${orderId}/${endpoint}`);
            if (response.success) {
                // Socket will handle the update, but we can optimistically update
                const order = this.orders.get(orderId);
                if (order) {
                    order.status = newStatus;
                    if (newStatus === 'ready') order.readyTime = new Date().toISOString();
                    if (newStatus === 'served') order.completedTime = new Date().toISOString();
                    this.updateStats();
                    this.render();
                }
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    },

    getBadgeClass(status) {
        switch (status?.toLowerCase()) {
            case 'pending': return 'badge-pending';
            case 'preparing': return 'badge-preparing';
            case 'ready': return 'badge-ready';
            case 'cancelled': return 'badge-cancelled';
            case 'served': return 'badge-served';
            default: return '';
        }
    },

    getActionButtonHTML(order) {
        const status = order.status?.toLowerCase();
        const orderId = order.orderId;
        
        if (status === 'pending') {
            return `<button class="btn btn-advance js-action-btn" data-id="${orderId}" data-next-status="preparing">
                        <i class="fa-solid fa-fire"></i> Start Prep
                    </button>`;
        } else if (status === 'preparing') {
            return `<button class="btn btn-advance js-action-btn" data-id="${orderId}" data-next-status="ready">
                        <i class="fa-solid fa-check"></i> Mark Ready
                    </button>`;
        } else if (status === 'ready') {
            return `<button class="btn btn-advance js-action-btn" data-id="${orderId}" data-next-status="served">
                        <i class="fa-solid fa-box-archive"></i> Mark Served
                    </button>`;
        }
        return `<span style="color: var(--text-muted); font-size: 0.85rem;">Done</span>`;
    },

    formatItems(order) {
        return order.items?.map(item => 
            `${item.quantity}x ${item.name}${item.notes ? ` <small style="color:var(--text-muted)">(${item.notes})</small>` : ''}`
        ).join('<br>') || 'No items';
    },

    render() {
        const filtered = this.getFilteredOrders();

        // Grid view (dashboard.html)
        if (this.gridContainer) {
            if (filtered.length === 0) {
                this.gridContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 32px;">
                        No <strong>${this.currentFilter}</strong> orders found in queue.
                    </div>`;
            } else {
                this.gridContainer.innerHTML = filtered.map(order => `
                    <div class="ticket-card ${order.status?.toLowerCase()}" data-order-id="${order.orderId}">
                        <div class="ticket-header">
                            <span class="ticket-id">#${order.orderId}</span>
                            <span class="badge ${this.getBadgeClass(order.status)}">${order.status}</span>
                        </div>
                        <div class="ticket-customer">
                            <i class="fa-solid fa-user"></i> ${order.customerName || 'Unknown'}
                        </div>
                        ${order.tableNumber && order.tableNumber !== 'N/A' ?
                            `<div class="ticket-table"><i class="fa-solid fa-table"></i> Table: ${order.tableNumber}</div>` : ''}
                        <div class="ticket-items">
                            ${this.formatItems(order)}
                        </div>
                        <div class="ticket-time">
                            <i class="fa-solid fa-clock"></i> ${this.getElapsedTime(order.createdAt || order.orderTime)} ago
                        </div>
                        <div class="ticket-actions-group">
                            ${this.getActionButtonHTML(order)}
                        </div>
                    </div>
                `).join('');

                this.gridContainer.querySelectorAll('.js-action-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const orderId = e.currentTarget.dataset.id;
                        const nextStatus = e.currentTarget.dataset.nextStatus;
                        this.updateOrderStatus(orderId, nextStatus);
                    });
                });
            }
        }

        // Table view (orders.html)
        if (this.tableBody) {
            if (filtered.length === 0) {
                this.tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">
                            No <strong>${this.currentFilter}</strong> orders found in queue.
                        </td>
                    </tr>`;
            } else {
                this.tableBody.innerHTML = filtered.map(order => {
                    const elapsed = this.getElapsedTime(order.createdAt || order.orderTime);
                    return `
                        <tr data-order-id="${order.orderId}">
                            <td><strong>#${order.orderId}</strong></td>
                            <td>${order.customerName || 'Unknown'}</td>
                            <td>${this.formatItems(order)}</td>
                            <td><span class="badge ${this.getBadgeClass(order.status)}">${order.status}</span></td>
                            <td>${elapsed}</td>
                            <td>${this.getActionButtonHTML(order)}</td>
                        </tr>`;
                }).join('');

                this.tableBody.querySelectorAll('.js-action-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const orderId = e.currentTarget.dataset.id;
                        const nextStatus = e.currentTarget.dataset.nextStatus;
                        this.updateOrderStatus(orderId, nextStatus);
                    });
                });
            }
        }
    },

    playNotificationSound() {
        const audio = document.getElementById('orderNotificationSound');
        if (audio) {
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    },

    startTimer() {
        this.updateInterval = setInterval(() => {
            this.gridContainer?.querySelectorAll('.ticket-time').forEach(el => {
                const orderId = el.closest('.ticket-card')?.dataset.orderId;
                const order = orderId ? this.orders.get(orderId) : null;
                if (order) {
                    el.innerHTML = `<i class="fa-solid fa-clock"></i> ${this.getElapsedTime(order.createdAt || order.orderTime)} ago`;
                }
            });
        }, 30000); // Update every 30 seconds
    }
};

// Make KDS globally accessible for debugging
window.KDS = KDS;