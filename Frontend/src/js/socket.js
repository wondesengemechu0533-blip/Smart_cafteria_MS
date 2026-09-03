/**
 * Smart Cafeteria Ordering System
 * Socket.io Client for Real-time Kitchen Dashboard
 */

const SOCKET_URL = (() => {
    try {
        if (typeof window !== "undefined" && window.location.hostname === "127.0.0.1") return "http://127.0.0.1:5000";
    } catch {}
    return "http://localhost:5000";
})();

class SocketClient {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.pendingJoins = new Set();
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            // Join kitchen room for kitchen staff
            if (this.isKitchenStaff()) {
                this.socket.emit('join:kitchen');
            }
            // Re-apply any order-room joins that were requested before connect.
            this.pendingJoins.forEach((roomId) => {
                this.socket.emit('order:join', roomId);
            });
            this.pendingJoins.clear();
            // Let consumers' socketClient.on("connect", cb) listeners fire too.
            this.emit('connect', undefined);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('order:new', (order) => {
            this.emit('order:new', order);
        });

        this.socket.on('order:status', (order) => {
            this.emit('order:status', order);
        });

        this.socket.on('order:payment', (order) => {
            this.emit('order:payment', order);
        });

        this.socket.on('order:created', (order) => {
            this.emit('order:created', order);
        });

        this.socket.on('notification:new', (notification) => {
            this.emit('notification:new', notification);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinOrderRoom(orderId) {
        if (!orderId) return;
        if (this.socket?.connected) {
            this.socket.emit('order:join', orderId);
        } else {
            // Connection is still in progress; remember to join once connected.
            this.pendingJoins.add(orderId);
        }
    }

    leaveOrderRoom(orderId) {
        this.pendingJoins.delete(orderId);
        if (this.socket?.connected) {
            this.socket.emit('order:leave', orderId);
        }
    }

    isKitchenStaff() {
        // Check top-level role keys first, then fall back to the stored user.
        let role = localStorage.getItem('role') || localStorage.getItem('userRole') || '';
        if (!role) {
            try {
                role = JSON.parse(localStorage.getItem('current_user'))?.role || '';
            } catch (e) {
                /* ignore */
            }
        }
        return ['kitchen', 'KITCHEN_STAFF', 'STAFF', 'admin', 'ADMIN'].includes(role);
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => cb(data));
        }
    }

    get connected() {
        return this.socket?.connected || false;
    }
}

export const socketClient = new SocketClient();
export default socketClient;