/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - ADMIN SETTINGS
 * ================================================================
 * Handles: Profile, Cafeteria Info, Language, Payment, Security,
 *          Order Settings, Notifications, Appearance
 * ================================================================
 */
(function () {
  "use strict";

  const DEFAULTS = {
    cafeteria_name: 'Smart Cafeteria',
    cafeteria_description: '',
    cafeteria_phone: '',
    cafeteria_email: '',
    cafeteria_address: '',
    cafeteria_opening_time: '07:00',
    cafeteria_closing_time: '22:00',
    cafeteria_logo_url: '',
    currency: 'ETB',
    default_language: 'en',
    allow_language_switch: true,
    payment_chapa_enabled: true,
    payment_provider: 'chapa',
    payment_status_mode: 'automatic',
    session_timeout_minutes: 60,
    login_max_attempts: 5,
    admin_account_enabled: true,
    two_factor_enabled: false,
    order_availability: true,
    maintenance_mode: false,
    order_cancellation_enabled: true,
    cancellation_window_minutes: 15,
    max_order_quantity: 10,
    minimum_order_amount: 0,
    default_preparation_time: 15,
    notify_new_orders: true,
    notify_payments: true,
    notify_low_stock: true,
    notify_user_accounts: false,
    theme: 'light',
    favicon_url: '',
    appearance_logo_url: ''
  };

  function showAlert(message, type) {
    const el = document.getElementById('settingsAlert');
    if (!el) return;
    el.textContent = message;
    el.className = 'alert-banner ' + (type || 'success');
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
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

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function val(id, fallback) { const el = $(id); return el ? el.value.trim() : (fallback || ''); }
  function num(id, fallback) { return Number(val(id, fallback)) || fallback; }
  function checked(id) { const el = $(id); return el ? el.checked : false; }

  /* =============================================
     1. ADMIN PROFILE
     ============================================= */
  async function loadProfile() {
    try {
      const data = await window.AdminAPI.get('/auth/me');
      const user = data.user || {};
      $('adminProfileName').value = user.name || '';
      $('adminProfileEmail').value = user.email || '';
      $('adminProfilePhone').value = user.phone || '';
      $('adminProfileAvatar').value = user.avatar || '';
    } catch (e) {
      showAlert('Failed to load profile: ' + (e.message || e), 'error');
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const btn = $('saveAdminProfileBtn');
    setLoading(btn, true);
    try {
      const data = await window.AdminAPI.put('/auth/me', {
        name: val('adminProfileName'),
        email: val('adminProfileEmail'),
        phone: val('adminProfilePhone'),
        avatar: val('adminProfileAvatar')
      });
      const profile = window.AdminAPI.getProfile() || {};
      const updated = Object.assign(profile, data.user);
      localStorage.setItem('userProfile', JSON.stringify(updated));
      try {
        const cur = JSON.parse(localStorage.getItem('current_user') || '{}');
        localStorage.setItem('current_user', JSON.stringify(Object.assign(cur, {
          name: updated.name, email: updated.email, phone: updated.phone, avatar: updated.avatar
        })));
        localStorage.setItem('userName', updated.name);
        localStorage.setItem('name', updated.name);
      } catch (_) {}
      showAlert('Admin profile saved');
    } catch (e) {
      showAlert('Failed to save profile: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     2. CAFETERIA INFORMATION
     ============================================= */
  function populateCafeteria(data) {
    if (!data) return;
    $('cafeteriaName').value = data.cafeteria_name || '';
    $('cafeteriaPhone').value = data.cafeteria_phone || '';
    $('cafeteriaEmail').value = data.cafeteria_email || '';
    $('cafeteriaAddress').value = data.cafeteria_address || '';
    $('cafeteriaOpeningTime').value = data.cafeteria_opening_time || '07:00';
    $('cafeteriaClosingTime').value = data.cafeteria_closing_time || '22:00';
    $('cafeteriaDescription').value = data.cafeteria_description || '';
    $('cafeteriaLogoUrl').value = data.cafeteria_logo_url || '';
  }

  async function saveCafeteriaInfo(e) {
    e.preventDefault();
    const btn = $('saveCafeInfoBtn');
    setLoading(btn, true);
    try {
      const logoFile = $('cafeteriaLogoFile').files[0];
      let logoUrl = val('cafeteriaLogoUrl');
      if (logoFile) {
        logoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(logoFile);
        });
      }
      const fields = [
        { key: 'cafeteria_name', value: val('cafeteriaName') },
        { key: 'cafeteria_phone', value: val('cafeteriaPhone') },
        { key: 'cafeteria_email', value: val('cafeteriaEmail') },
        { key: 'cafeteria_address', value: val('cafeteriaAddress') },
        { key: 'cafeteria_opening_time', value: val('cafeteriaOpeningTime') },
        { key: 'cafeteria_closing_time', value: val('cafeteriaClosingTime') },
        { key: 'cafeteria_description', value: val('cafeteriaDescription') },
        { key: 'cafeteria_logo_url', value: logoUrl }
      ];
      for (const f of fields) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(f.key), { value: f.value });
      }
      showAlert('Cafeteria information saved');
    } catch (e) {
      showAlert('Failed to save cafeteria info: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     3. LANGUAGE
     ============================================= */
  async function saveLanguage(e) {
    e.preventDefault();
    const btn = $('saveLanguageBtn');
    setLoading(btn, true);
    try {
      await window.AdminAPI.put('/admin/settings/default_language', { value: val('defaultLanguage') });
      await window.AdminAPI.put('/admin/settings/allow_language_switch', { value: checked('allowLanguageSwitch') });
      showAlert('Language settings saved');
    } catch (e) {
      showAlert('Failed to save language: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     4. PAYMENT SETTINGS
     ============================================= */
  async function savePayment(e) {
    e.preventDefault();
    const btn = $('savePaymentBtn');
    setLoading(btn, true);
    try {
      await window.AdminAPI.put('/admin/settings/payment_chapa_enabled', { value: checked('paymentChapaEnabled') });
      await window.AdminAPI.put('/admin/settings/currency', { value: val('paymentCurrency') });
      await window.AdminAPI.put('/admin/settings/payment_provider', { value: val('paymentProvider') });
      await window.AdminAPI.put('/admin/settings/payment_status_mode', { value: val('paymentStatusMode') });
      showAlert('Payment settings saved');
    } catch (e) {
      showAlert('Failed to save payment settings: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     5. SECURITY
     ============================================= */
  async function changePassword() {
    const cur = val('currentPassword');
    const nw = val('newPassword');
    const cf = val('confirmPassword');
    if (!cur || !nw) {
      showAlert('Please fill in current and new password', 'error');
      return;
    }
    if (nw !== cf) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    if (nw.length < 6) {
      showAlert('New password must be at least 6 characters', 'error');
      return;
    }
    const btn = $('changePasswordBtn');
    setLoading(btn, true);
    try {
      await window.AdminAPI.put('/auth/password', { currentPassword: cur, newPassword: nw });
      $('currentPassword').value = '';
      $('newPassword').value = '';
      $('confirmPassword').value = '';
      showAlert('Password changed successfully');
    } catch (e) {
      showAlert('Failed to change password: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function saveSecurity(e) {
    e.preventDefault();
    const btn = $('saveSecurityBtn');
    setLoading(btn, true);
    try {
      await window.AdminAPI.put('/admin/settings/session_timeout_minutes', { value: num('sessionTimeout', 60) });
      await window.AdminAPI.put('/admin/settings/login_max_attempts', { value: num('loginMaxAttempts', 5) });
      await window.AdminAPI.put('/admin/settings/admin_account_enabled', { value: checked('adminAccountEnabled') });
      await window.AdminAPI.put('/admin/settings/two_factor_enabled', { value: checked('twoFactorEnabled') });
      showAlert('Security settings saved');
    } catch (e) {
      showAlert('Failed to save security: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     6. ORDER SETTINGS
     ============================================= */
  async function saveOrderSettings(e) {
    e.preventDefault();
    const btn = $('saveOrderSettingsBtn');
    setLoading(btn, true);
    try {
      const fields = [
        { key: 'order_availability', value: checked('orderAvailability') },
        { key: 'maintenance_mode', value: checked('maintenanceMode') },
        { key: 'order_cancellation_enabled', value: checked('orderCancellationEnabled') },
        { key: 'cancellation_window_minutes', value: num('cancellationWindow', 15) },
        { key: 'max_order_quantity', value: num('maxOrderQuantity', 10) },
        { key: 'minimum_order_amount', value: num('minimumOrderAmount', 0) },
        { key: 'default_preparation_time', value: num('defaultPreparationTime', 15) }
      ];
      for (const f of fields) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(f.key), { value: f.value });
      }
      showAlert('Order settings saved');
    } catch (e) {
      showAlert('Failed to save order settings: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     7. NOTIFICATIONS
     ============================================= */
  async function saveNotifications(e) {
    e.preventDefault();
    const btn = $('saveNotificationsBtn');
    setLoading(btn, true);
    try {
      await window.AdminAPI.put('/admin/settings/notify_new_orders', { value: checked('notifyNewOrders') });
      await window.AdminAPI.put('/admin/settings/notify_payments', { value: checked('notifyPayments') });
      await window.AdminAPI.put('/admin/settings/notify_low_stock', { value: checked('notifyLowStock') });
      await window.AdminAPI.put('/admin/settings/notify_user_accounts', { value: checked('notifyUserAccounts') });
      showAlert('Notification settings saved');
    } catch (e) {
      showAlert('Failed to save notifications: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     8. APPEARANCE
     ============================================= */
  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.add('theme-light');
    }
    localStorage.setItem('scos_theme', theme);
  }

  async function saveAppearance(e) {
    e.preventDefault();
    const btn = $('saveAppearanceBtn');
    setLoading(btn, true);
    try {
      const logoFile = $('appearanceLogoFile').files[0];
      let logoUrl = val('appearanceLogoUrl');
      if (logoFile) {
        logoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(logoFile);
        });
      }
      await window.AdminAPI.put('/admin/settings/theme', { value: val('themeSelect') });
      await window.AdminAPI.put('/admin/settings/favicon_url', { value: val('faviconUrl') });
      await window.AdminAPI.put('/admin/settings/appearance_logo_url', { value: logoUrl });
      applyTheme(val('themeSelect'));
      showAlert('Appearance settings saved');
    } catch (e) {
      showAlert('Failed to save appearance: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     LOAD ALL SETTINGS INTO FORMS
     ============================================= */
  async function loadAllSettings() {
    try {
      const data = await window.AdminAPI.get('/admin/settings');
      if (!data.success || !data.settings) return;
      const map = {};
      for (const s of data.settings) map[s.key] = s.value;

      // Cafeteria
      populateCafeteria(map);
      // Language
      $('defaultLanguage').value = map.default_language || DEFAULTS.default_language;
      $('allowLanguageSwitch').checked = map.allow_language_switch !== false;
      // Payment
      $('paymentChapaEnabled').checked = map.payment_chapa_enabled !== false;
      $('paymentCurrency').value = map.currency || DEFAULTS.currency;
      $('paymentProvider').value = map.payment_provider || DEFAULTS.payment_provider;
      $('paymentStatusMode').value = map.payment_status_mode || DEFAULTS.payment_status_mode;
      // Security
      $('sessionTimeout').value = map.session_timeout_minutes || DEFAULTS.session_timeout_minutes;
      $('loginMaxAttempts').value = map.login_max_attempts || DEFAULTS.login_max_attempts;
      $('adminAccountEnabled').checked = map.admin_account_enabled !== false;
      $('twoFactorEnabled').checked = map.two_factor_enabled === true;
      // Order
      $('orderAvailability').checked = map.order_availability !== false;
      $('maintenanceMode').checked = map.maintenance_mode === true;
      $('orderCancellationEnabled').checked = map.order_cancellation_enabled !== false;
      $('cancellationWindow').value = map.cancellation_window_minutes ?? DEFAULTS.cancellation_window_minutes;
      $('maxOrderQuantity').value = map.max_order_quantity || DEFAULTS.max_order_quantity;
      $('minimumOrderAmount').value = map.minimum_order_amount ?? DEFAULTS.minimum_order_amount;
      $('defaultPreparationTime').value = map.default_preparation_time ?? DEFAULTS.default_preparation_time;
      // Notifications
      $('notifyNewOrders').checked = map.notify_new_orders !== false;
      $('notifyPayments').checked = map.notify_payments !== false;
      $('notifyLowStock').checked = map.notify_low_stock !== false;
      $('notifyUserAccounts').checked = map.notify_user_accounts === true;
      // Appearance
      $('themeSelect').value = map.theme || DEFAULTS.theme;
      $('faviconUrl').value = map.favicon_url || '';
      $('appearanceLogoUrl').value = map.appearance_logo_url || '';
      applyTheme(map.theme || DEFAULTS.theme);
    } catch (e) {
      showAlert('Failed to load settings: ' + (e.message || e), 'error');
    }
  }

  /* =============================================
     RESET
     ============================================= */
  async function resetSettings() {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) return;
    const btn = $('resetSettingsBtn');
    setLoading(btn, true);
    try {
      for (const key of Object.keys(DEFAULTS)) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(key), { value: DEFAULTS[key] });
      }
      await loadAllSettings();
      showAlert('Settings reset to defaults');
    } catch (e) {
      showAlert('Failed to reset: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     SAVE ALL
     ============================================= */
  async function saveAllSettings() {
    const btn = $('saveAllSettingsBtn');
    setLoading(btn, true);
    try {
      const all = {
        cafeteria_name: val('cafeteriaName'),
        cafeteria_phone: val('cafeteriaPhone'),
        cafeteria_email: val('cafeteriaEmail'),
        cafeteria_address: val('cafeteriaAddress'),
        cafeteria_opening_time: val('cafeteriaOpeningTime'),
        cafeteria_closing_time: val('cafeteriaClosingTime'),
        cafeteria_description: val('cafeteriaDescription'),
        cafeteria_logo_url: val('cafeteriaLogoUrl'),
        default_language: val('defaultLanguage'),
        allow_language_switch: checked('allowLanguageSwitch'),
        payment_chapa_enabled: checked('paymentChapaEnabled'),
        currency: val('paymentCurrency'),
        payment_provider: val('paymentProvider'),
        payment_status_mode: val('paymentStatusMode'),
        session_timeout_minutes: num('sessionTimeout', 60),
        login_max_attempts: num('loginMaxAttempts', 5),
        admin_account_enabled: checked('adminAccountEnabled'),
        two_factor_enabled: checked('twoFactorEnabled'),
        order_availability: checked('orderAvailability'),
        maintenance_mode: checked('maintenanceMode'),
        order_cancellation_enabled: checked('orderCancellationEnabled'),
        cancellation_window_minutes: num('cancellationWindow', 15),
        max_order_quantity: num('maxOrderQuantity', 10),
        minimum_order_amount: num('minimumOrderAmount', 0),
        default_preparation_time: num('defaultPreparationTime', 15),
        notify_new_orders: checked('notifyNewOrders'),
        notify_payments: checked('notifyPayments'),
        notify_low_stock: checked('notifyLowStock'),
        notify_user_accounts: checked('notifyUserAccounts'),
        theme: val('themeSelect'),
        favicon_url: val('faviconUrl'),
        appearance_logo_url: val('appearanceLogoUrl')
      };
      for (const [key, value] of Object.entries(all)) {
        await window.AdminAPI.put('/admin/settings/' + encodeURIComponent(key), { value });
      }
      applyTheme(val('themeSelect'));
      showAlert('All settings saved');
    } catch (e) {
      showAlert('Failed to save: ' + (e.message || e), 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  /* =============================================
     IMAGE PREVIEWS
     ============================================= */
  function setupImagePreview(inputId, previewRowId, previewImgId, removeBtnId) {
    const input = $(inputId);
    const previewRow = $(previewRowId);
    const previewImg = $(previewImgId);
    const removeBtn = $(removeBtnId);
    if (!input || !previewRow) return;

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          previewImg.src = ev.target.result;
          previewRow.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        input.value = '';
        previewRow.style.display = 'none';
        previewImg.src = '';
      });
    }
  }

  /* =============================================
     INIT
     ============================================= */
  function bindEvents() {
    $('adminProfileForm')?.addEventListener('submit', saveProfile);
    $('cafeteriaInfoForm')?.addEventListener('submit', saveCafeteriaInfo);
    $('languageForm')?.addEventListener('submit', saveLanguage);
    $('paymentForm')?.addEventListener('submit', savePayment);
    $('changePasswordBtn')?.addEventListener('click', changePassword);
    $('securityForm')?.addEventListener('submit', saveSecurity);
    $('orderSettingsForm')?.addEventListener('submit', saveOrderSettings);
    $('notificationForm')?.addEventListener('submit', saveNotifications);
    $('appearanceForm')?.addEventListener('submit', saveAppearance);
    $('resetSettingsBtn')?.addEventListener('click', resetSettings);
    $('saveAllSettingsBtn')?.addEventListener('click', saveAllSettings);

    setupImagePreview('cafeteriaLogoFile', 'logoPreviewRow', 'logoPreview', 'removeLogoBtn');
    setupImagePreview('appearanceLogoFile', 'appearanceLogoPreviewRow', 'appearanceLogoPreview', 'removeAppearanceLogoBtn');
  }

  function init() {
    bindEvents();
    loadProfile();
    loadAllSettings();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
