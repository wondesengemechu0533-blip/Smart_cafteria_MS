/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - ADMIN SETTINGS
 * ================================================================
 * Loads and saves system settings via admin-api.js
 * ================================================================
 */
(function () {
  "use strict";

  const FORM_IDS = [
    'cafeteriaName', 'currency', 'supportEmail', 'supportPhone',
    'orderAvailability', 'maxOrderQuantity', 'maintenanceMode'
  ];

  const DEFAULTS = {
    cafeteria_name: 'Smart Cafeteria', currency: 'ETB', support_email: 'support@smartcafeteria.com',
    support_phone: '+251 911 000 000', order_availability: true, max_order_quantity: 10, maintenance_mode: false,
    minimum_order_amount: 0, order_cancellation_enabled: true, cancellation_window_minutes: 15,
    default_preparation_time: 15, payment_telebirr_enabled: true, payment_chapa_enabled: true,
    payment_cbe_birr_enabled: false, payment_provider: 'chapa', payment_status_mode: 'automatic',
    default_language: 'en', notify_new_orders: true, notify_payments: true, notify_low_stock: true,
    notify_user_accounts: true, session_timeout_minutes: 60, login_max_attempts: 5, two_factor_enabled: false
  };

  function showAlert(message, type) {
    const el = document.getElementById('settingsAlert');
    if (!el) return;
    el.textContent = message;
    el.className = 'alert-banner ' + (type || 'success');
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || 'Save';
    }
  }

  function populateForm(data) {
    if (!data) return;
    document.getElementById('cafeteriaName').value = data.cafeteria_name || 'Smart Cafeteria';
    document.getElementById('currency').value = data.currency || 'ETB';
    document.getElementById('supportEmail').value = data.support_email || '';
    document.getElementById('supportPhone').value = data.support_phone || '';
    document.getElementById('orderAvailability').checked = data.order_availability !== false;
    document.getElementById('maxOrderQuantity').value = data.max_order_quantity || 10;
    document.getElementById('maintenanceMode').checked = data.maintenance_mode === true;
    document.getElementById('sessionTimeout').value = data.session_timeout_minutes || DEFAULTS.session_timeout_minutes;
    document.getElementById('loginMaxAttempts').value = data.login_max_attempts || DEFAULTS.login_max_attempts;
    document.getElementById('twoFactorEnabled').checked = data.two_factor_enabled === true;
    document.getElementById('minimumOrderAmount').value = data.minimum_order_amount ?? DEFAULTS.minimum_order_amount;
    document.getElementById('cancellationWindow').value = data.cancellation_window_minutes ?? DEFAULTS.cancellation_window_minutes;
    document.getElementById('defaultPreparationTime').value = data.default_preparation_time ?? DEFAULTS.default_preparation_time;
    document.getElementById('orderCancellationEnabled').checked = data.order_cancellation_enabled !== false;
    document.getElementById('paymentTelebirrEnabled').checked = data.payment_telebirr_enabled !== false;
    document.getElementById('paymentChapaEnabled').checked = data.payment_chapa_enabled !== false;
    document.getElementById('paymentCbeBirrEnabled').checked = data.payment_cbe_birr_enabled === true;
    document.getElementById('paymentProvider').value = data.payment_provider || DEFAULTS.payment_provider;
    document.getElementById('paymentStatusMode').value = data.payment_status_mode || DEFAULTS.payment_status_mode;
    document.getElementById('defaultLanguage').value = data.default_language || DEFAULTS.default_language;
    document.getElementById('notifyNewOrders').checked = data.notify_new_orders !== false;
    document.getElementById('notifyPayments').checked = data.notify_payments !== false;
    document.getElementById('notifyLowStock').checked = data.notify_low_stock !== false;
    document.getElementById('notifyUserAccounts').checked = data.notify_user_accounts !== false;
  }

  function collectForm() {
    return {
      cafeteria_name: document.getElementById('cafeteriaName').value.trim(),
      currency: document.getElementById('currency').value,
      support_email: document.getElementById('supportEmail').value.trim(),
      support_phone: document.getElementById('supportPhone').value.trim(),
      order_availability: document.getElementById('orderAvailability').checked,
      max_order_quantity: parseInt(document.getElementById('maxOrderQuantity').value, 10) || 10,
      maintenance_mode: document.getElementById('maintenanceMode').checked,
      session_timeout_minutes: Number(document.getElementById('sessionTimeout').value) || DEFAULTS.session_timeout_minutes,
      login_max_attempts: Number(document.getElementById('loginMaxAttempts').value) || DEFAULTS.login_max_attempts,
      two_factor_enabled: document.getElementById('twoFactorEnabled').checked,
      minimum_order_amount: Number(document.getElementById('minimumOrderAmount').value) || 0,
      cancellation_window_minutes: Number(document.getElementById('cancellationWindow').value) || 0,
      default_preparation_time: Number(document.getElementById('defaultPreparationTime').value) || DEFAULTS.default_preparation_time,
      order_cancellation_enabled: document.getElementById('orderCancellationEnabled').checked,
      payment_telebirr_enabled: document.getElementById('paymentTelebirrEnabled').checked,
      payment_chapa_enabled: document.getElementById('paymentChapaEnabled').checked,
      payment_cbe_birr_enabled: document.getElementById('paymentCbeBirrEnabled').checked,
      payment_provider: document.getElementById('paymentProvider').value,
      payment_status_mode: document.getElementById('paymentStatusMode').value,
      default_language: document.getElementById('defaultLanguage').value,
      notify_new_orders: document.getElementById('notifyNewOrders').checked,
      notify_payments: document.getElementById('notifyPayments').checked,
      notify_low_stock: document.getElementById('notifyLowStock').checked,
      notify_user_accounts: document.getElementById('notifyUserAccounts').checked,
    };
  }

  async function loadSettings() {
    try {
      const data = await window.AdminAPI.get('/admin/settings');
      if (data.success && data.settings) {
        const map = {};
        for (const s of data.settings) {
          map[s.key] = s.value;
        }
        populateForm(map);
      }
    } catch (error) {
      showAlert('Failed to load settings: ' + (error.message || error), 'error');
    }
  }

  async function loadProfile() {
    try {
      const data = await window.AdminAPI.get('/auth/me');
      const user = data.user || {};
      document.getElementById('adminProfileName').value = user.name || '';
      document.getElementById('adminProfileEmail').value = user.email || '';
      document.getElementById('adminProfilePhone').value = user.phone || '';
      document.getElementById('adminProfileAvatar').value = user.avatar || '';
    } catch (error) { showAlert('Failed to load admin profile: ' + (error.message || error), 'error'); }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('saveAdminProfileBtn');
    setLoading(btn, true);
    try {
      const data = await window.AdminAPI.put('/auth/me', {
        name: document.getElementById('adminProfileName').value.trim(),
        email: document.getElementById('adminProfileEmail').value.trim(),
        phone: document.getElementById('adminProfilePhone').value.trim(),
        avatar: document.getElementById('adminProfileAvatar').value.trim()
      });
      const profile = window.AdminAPI.getProfile() || {};
      const updated = Object.assign(profile, data.user);
      localStorage.setItem('userProfile', JSON.stringify(updated));
      // Sync current_user and name helpers so the updated admin profile shows
      // in the navbar / profile icon across the admin dashboard.
      try {
        const savedCurrent = JSON.parse(localStorage.getItem('current_user')) || {};
        localStorage.setItem('current_user', JSON.stringify(Object.assign(savedCurrent, {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          avatar: updated.avatar,
          role: savedCurrent.role || 'admin'
        })));
        localStorage.setItem('userName', updated.name);
        localStorage.setItem('name', updated.name);
      } catch (e) {}
      showAlert('Admin profile saved successfully');
    } catch (error) { showAlert('Failed to save admin profile: ' + (error.message || error), 'error'); }
    finally { setLoading(btn, false); }
  }

  async function saveSettings(e) {
    e.preventDefault();
    const btn = document.getElementById('saveSettingsBtn');
    setLoading(btn, true);

    const payload = collectForm();
    const keys = Object.keys(payload);

    try {
      for (const key of keys) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(key), { value: payload[key] });
      }
      showAlert('Settings saved successfully');
    } catch (error) {
      showAlert('Failed to save settings: ' + (error.message || error), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function resetSettings() {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) return;
    const btn = document.getElementById('resetSettingsBtn');
    setLoading(btn, true);
    try {
      const defaults = DEFAULTS;
      for (const key of Object.keys(defaults)) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(key), { value: defaults[key] });
      }
      populateForm(defaults);
      showAlert('Settings reset to defaults');
    } catch (error) {
      showAlert('Failed to reset: ' + (error.message || error), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  function bindEvents() {
    const form = document.getElementById('settingsForm');
    if (form) form.addEventListener('submit', saveSettings);
    const profileForm = document.getElementById('adminProfileForm');
    if (profileForm) profileForm.addEventListener('submit', saveProfile);

    const resetBtn = document.getElementById('resetSettingsBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetSettings);
  }

  function init() {
    bindEvents();
    loadSettings();
    loadProfile();
  }

  document.addEventListener('DOMContentLoaded', init);
})();