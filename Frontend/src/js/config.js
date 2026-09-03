/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - CONFIGURATION
 * ================================================================
 * All global configuration settings, constants, and mock data.
 * ================================================================
 */

// ===== 1. APP CONFIGURATION =====
export const APP_CONFIG = {
    name: 'Smart Cafeteria Ordering System',
    version: '1.0.0',
    author: 'Kidus Birhanu, Sintayehu Begashaw, Wondesen Gemechu',
    year: 2026,
    institution: 'Debre Berhan University',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'am'],
};

// ===== 2. API CONFIGURATION (Future Backend) =====
export const API_CONFIG = {
    baseURL: (typeof process !== 'undefined' && process.env && process.env.API_URL) || 'https://api.smartcafeteria.com/v1',
    timeout: 30000,
    endpoints: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            profile: '/auth/profile',
        },
        users: {
            list: '/users',
            get: '/users/:id',
            update: '/users/:id',
            delete: '/users/:id',
        },
        menu: {
            list: '/menu',
            categories: '/menu/categories',
            category: '/menu/category/:id',
            item: '/menu/:id',
            create: '/menu',
            update: '/menu/:id',
            delete: '/menu/:id',
        },
        cart: {
            get: '/cart',
            add: '/cart/add',
            update: '/cart/update/:itemId',
            remove: '/cart/remove/:itemId',
            clear: '/cart/clear',
        },
        orders: {
            list: '/orders',
            myOrders: '/orders/myorders',
            get: '/orders/:id',
            create: '/orders',
            updateStatus: '/orders/:id/status',
            markReady: '/orders/:id/ready',
            status: '/orders/:id/status',
        },
        payments: {
            initializeChapa: '/payments/chapa/initialize',
            verifyChapa: '/payments/chapa/verify/:txRef',
            list: '/payments',
            getByOrder: '/payments/order/:orderId',
        },
        notifications: {
            list: '/notifications',
            unread: '/notifications/unread',
            markRead: '/notifications/:id/read',
            delete: '/notifications/:id',
        },
        reports: {
            daily: '/reports/daily',
            sales: '/reports/sales',
            popular: '/reports/popular',
            payments: '/reports/payments',
        },
    },
};

// ===== 3. STORAGE KEYS =====
export const STORAGE_KEYS = {
    user: 'scos_user',
    token: 'scos_token',
    cart: 'scos_cart',
    theme: 'scos_theme',
    language: 'scos_language',
    notifications: 'scos_notifications',
};

// ===== 4. ROLES =====
export const ROLES = {
    CUSTOMER: 'customer',
    KITCHEN: 'kitchen',
    ADMIN: 'admin',
};

// ===== 5. ORDER STATUSES =====
export const ORDER_STATUS = {
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY: 'ready',
    SERVED: 'served',
    CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
    pending: { en: 'Pending', am: 'በመጠበቅ ላይ' },
    preparing: { en: 'Preparing', am: 'በዝግጅት ላይ' },
    ready: { en: 'Ready', am: 'ዝግጁ' },
    served: { en: 'Served', am: 'ተሰርቷል' },
    cancelled: { en: 'Cancelled', am: 'ተሰርዟል' },
};

export const ORDER_STATUS_COLORS = {
    pending: 'warning',
    preparing: 'info',
    ready: 'success',
    served: 'gray',
    cancelled: 'danger',
};

// ===== 6. PAYMENT STATUSES =====
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SIMULATED: 'simulated',
    FAILED: 'failed',
};

export const PAYMENT_METHODS = {
    CHAPA: 'CHAPA',
};

// ===== 7. MENU CATEGORIES =====
export const MENU_CATEGORIES = [
    { id: 'breakfast', name: { en: 'Breakfast', am: 'ቁርስ' }, icon: '🌅' },
{ id: 'main-meals', name: { en: 'Main Meals', am: 'ዋና ምግቦች' }, icon: '🍛' },
    { id: 'fasting', name: { en: 'Fasting Meals', am: 'የጾም ምግቦች' }, icon: '🥗' },
    { id: 'beverages', name: { en: 'Beverages', am: 'መጠጦች' }, icon: '🥤' },
    { id: 'snacks', name: { en: 'Snacks', am: 'ቀላል ምግቦች' }, icon: '🍿' },
];

// ===== 8. DEFAULT SETTINGS =====
export const DEFAULT_SETTINGS = {
    language: 'en',
    theme: 'light',
    currency: 'ETB',
    currencySymbol: 'ብር',
    taxRate: 0,
    serviceCharge: 0,
};

// ===== 9. REGEX PATTERNS =====
export const PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+251[0-9]{9}|(09|07)[0-9]{8})$/,
    password: /^.{6,}$/,
    name: /^[a-zA-Z\u1200-\u137F\s]{2,50}$/,
};