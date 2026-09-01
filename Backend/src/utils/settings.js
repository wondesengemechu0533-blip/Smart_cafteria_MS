const Setting = require('../models/Setting');

const DEFAULT_SETTINGS = [
  {
    key: 'cafeteria_name',
    value: 'Smart Cafeteria',
    type: 'string',
    group: 'general',
    label: 'Cafeteria Name',
  },
  {
    key: 'currency',
    value: 'ETB',
    type: 'string',
    group: 'general',
    label: 'Currency',
  },
  {
    key: 'support_email',
    value: 'support@smartcafeteria.com',
    type: 'string',
    group: 'general',
    label: 'Support Email',
  },
  {
    key: 'support_phone',
    value: '+251 911 000 000',
    type: 'string',
    group: 'general',
    label: 'Support Phone',
  },
  {
    key: 'order_availability',
    value: true,
    type: 'boolean',
    group: 'operations',
    label: 'Order Availability',
  },
  {
    key: 'max_order_quantity',
    value: 10,
    type: 'number',
    group: 'operations',
    label: 'Maximum Order Quantity',
  },
  {
    key: 'maintenance_mode',
    value: false,
    type: 'boolean',
    group: 'operations',
    label: 'Maintenance Mode',
  },
  { key: 'minimum_order_amount', value: 0, type: 'number', group: 'orders', label: 'Minimum Order Amount' },
  { key: 'order_cancellation_enabled', value: true, type: 'boolean', group: 'orders', label: 'Order Cancellation' },
  { key: 'cancellation_window_minutes', value: 15, type: 'number', group: 'orders', label: 'Cancellation Window (minutes)' },
  { key: 'default_preparation_time', value: 15, type: 'number', group: 'orders', label: 'Default Preparation Time (minutes)' },
  { key: 'payment_chapa_enabled', value: true, type: 'boolean', group: 'payments', label: 'Chapa Payments' },
  { key: 'payment_provider', value: 'chapa', type: 'string', group: 'payments', label: 'Default Payment Provider' },
  { key: 'payment_status_mode', value: 'automatic', type: 'string', group: 'payments', label: 'Payment Status Mode' },
  { key: 'default_language', value: 'en', type: 'string', group: 'language', label: 'Default System Language' },
  { key: 'notify_new_orders', value: true, type: 'boolean', group: 'notifications', label: 'New Order Notifications' },
  { key: 'notify_payments', value: true, type: 'boolean', group: 'notifications', label: 'Payment Notifications' },
  { key: 'notify_low_stock', value: true, type: 'boolean', group: 'notifications', label: 'Low Stock Notifications' },
  { key: 'notify_user_accounts', value: true, type: 'boolean', group: 'notifications', label: 'User Account Notifications' },
  { key: 'session_timeout_minutes', value: 60, type: 'number', group: 'security', label: 'Session Timeout (minutes)' },
  { key: 'login_max_attempts', value: 5, type: 'number', group: 'security', label: 'Maximum Login Attempts' },
  { key: 'two_factor_enabled', value: false, type: 'boolean', group: 'security', label: 'Two-Factor Authentication' },
];

async function ensureDefaultSettings() {
  try {
    const existingSettings = await Setting.find({}, { key: 1 }).lean();
    const existingKeys = new Set(existingSettings.map(s => s.key));
    
    const toInsert = DEFAULT_SETTINGS.filter(s => !existingKeys.has(s.key));
    
    if (toInsert.length > 0) {
      await Setting.insertMany(toInsert);
    }
  } catch (error) {
    console.error('Settings initialization error:', error.message);
  }
}

function coerceValue(key, value) {
  const def = DEFAULT_SETTINGS.find(s => s.key === key);
  if (!def) return value;
  if (def.type === 'boolean') return value === 'true' || value === true || value === 1 || value === '1';
  if (def.type === 'number') {
    const n = Number(value);
    return isNaN(n) ? def.value : n;
  }
  return String(value);
}

async function getSettingsMap({ includeProtected = false } = {}) {
  const filter = includeProtected ? {} : { protected: { $ne: true } };
  const settings = await Setting.find(filter).lean();
  const map = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  for (const def of DEFAULT_SETTINGS) {
    if (map[def.key] === undefined) {
      map[def.key] = def.value;
    }
  }
  return map;
}

async function getPublicSettings() {
  const map = await getSettingsMap({ includeProtected: false });
  return {
    cafeteriaName: map.cafeteria_name,
    currency: map.currency,
    orderAvailability: map.order_availability,
    maintenanceMode: map.maintenance_mode,
  };
}

module.exports = {
  DEFAULT_SETTINGS,
  ensureDefaultSettings,
  coerceValue,
  getSettingsMap,
  getPublicSettings,
};