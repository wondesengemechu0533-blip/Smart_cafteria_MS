/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - ADMIN SETTINGS
 * ================================================================
 * All sections: Profile, Cafeteria Info, Language, Payment, Security,
 *               Orders, Notifications, Appearance
 * ================================================================
 */
(function () {
  "use strict";

  const API = () => window.AdminAPI;

  function $(id) { return document.getElementById(id); }
  function val(id, fb) { const el = $(id); return el ? (el.value || '').trim() : (fb || ''); }
  function num(id, fb) { return Number(val(id, String(fb))) || fb; }
  function chk(id) { const el = $(id); return el ? !!el.checked : false; }

  /* ---------- alert / loading ---------- */
  function showAlert(msg, type) {
    const el = $('settingsAlert');
    if (!el) return;
    el.textContent = msg;
    el.className = 'alert-banner ' + (type || 'success');
    el.style.display = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.style.display = 'none'; }, 4000);
  }

  function setLoading(btn, on) {
    if (!btn) return;
    if (on) {
      btn.disabled = true;
      btn._orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    } else {
      btn.disabled = false;
      btn.innerHTML = btn._orig || btn.innerHTML;
    }
  }

  /* ---------- save single setting ---------- */
  async function saveSetting(key, value) {
    return API().put('/admin/settings/' + encodeURIComponent(key), { value });
  }

  /* ---------- load all settings as map ---------- */
  async function loadSettingsMap() {
    const data = await API().get('/admin/settings');
    const map = {};
    if (data.success && Array.isArray(data.settings)) {
      for (const s of data.settings) map[s.key] = s.value;
    }
    return map;
  }

  /* =============================================
     1. ADMIN PROFILE
     ============================================= */
  async function loadProfile() {
    try {
      const data = await API().get('/auth/me');
      const u = data.user || {};
      $('adminProfileName').value = u.name || '';
      $('adminProfileEmail').value = u.email || '';
      $('adminProfilePhone').value = u.phone || '';
      $('adminProfileAvatar').value = u.avatar || '';
    } catch (e) { showAlert('Failed to load profile: ' + e.message, 'error'); }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const btn = $('saveAdminProfileBtn');
    setLoading(btn, true);
    try {
      const data = await API().put('/auth/me', {
        name: val('adminProfileName'),
        email: val('adminProfileEmail'),
        phone: val('adminProfilePhone'),
        avatar: val('adminProfileAvatar')
      });
      // Sync localStorage
      const profile = API().getProfile() || {};
      const updated = Object.assign(profile, data.user);
      localStorage.setItem('userProfile', JSON.stringify(updated));
      try {
        const cur = JSON.parse(localStorage.getItem('current_user') || '{}');
        Object.assign(cur, { name: updated.name, email: updated.email, phone: updated.phone, avatar: updated.avatar });
        localStorage.setItem('current_user', JSON.stringify(cur));
        localStorage.setItem('userName', updated.name);
        localStorage.setItem('name', updated.name);
      } catch (_) {}
      showAlert('Admin profile saved');
    } catch (e) { showAlert('Failed to save profile: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     2. CAFETERIA INFORMATION
     ============================================= */
  function populateCafeteria(m) {
    $('cafeteriaName').value = m.cafeteria_name || '';
    $('cafeteriaDescription').value = m.cafeteria_description || '';
    $('cafeteriaPhone').value = m.cafeteria_phone || '';
    $('cafeteriaEmail').value = m.cafeteria_email || '';
    $('cafeteriaAddress').value = m.cafeteria_address || '';
    $('cafeteriaOpeningTime').value = m.cafeteria_opening_time || '07:00';
    $('cafeteriaClosingTime').value = m.cafeteria_closing_time || '22:00';
    $('cafeteriaLogoUrl').value = m.cafeteria_logo_url || '';
  }

  async function saveCafeteriaInfo(e) {
    e.preventDefault();
    const btn = $('saveCafeInfoBtn');
    setLoading(btn, true);
    try {
      // Handle logo file → base64
      let logoUrl = val('cafeteriaLogoUrl');
      const logoFile = $('cafeteriaLogoFile').files[0];
      if (logoFile) {
        if (logoFile.size > 2 * 1024 * 1024) { showAlert('Logo must be under 2 MB', 'error'); return; }
        logoUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result);
          r.onerror = rej;
          r.readAsDataURL(logoFile);
        });
      }
      const fields = {
        cafeteria_name: val('cafeteriaName'),
        cafeteria_description: val('cafeteriaDescription'),
        cafeteria_phone: val('cafeteriaPhone'),
        cafeteria_email: val('cafeteriaEmail'),
        cafeteria_address: val('cafeteriaAddress'),
        cafeteria_opening_time: val('cafeteriaOpeningTime'),
        cafeteria_closing_time: val('cafeteriaClosingTime'),
        cafeteria_logo_url: logoUrl
      };
      for (const [k, v] of Object.entries(fields)) await saveSetting(k, v);
      showAlert('Cafeteria information saved');
    } catch (e) { showAlert('Failed to save cafeteria info: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     3. LANGUAGE
     ============================================= */
  function populateLanguage(m) {
    $('defaultLanguage').value = m.default_language || 'en';
    $('allowLanguageSwitch').checked = m.allow_language_switch !== false;
  }

  async function saveLanguage(e) {
    e.preventDefault();
    const btn = $('saveLanguageBtn');
    setLoading(btn, true);
    try {
      await saveSetting('default_language', val('defaultLanguage'));
      await saveSetting('allow_language_switch', chk('allowLanguageSwitch'));
      showAlert('Language settings saved');
    } catch (e) { showAlert('Failed to save language: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     4. PAYMENT SETTINGS
     ============================================= */
  function populatePayment(m) {
    $('paymentChapaEnabled').checked = m.payment_chapa_enabled !== false;
    $('paymentCurrency').value = m.currency || 'ETB';
    $('paymentProvider').value = m.payment_provider || 'chapa';
    $('paymentStatusMode').value = m.payment_status_mode || 'automatic';
  }

  async function savePayment(e) {
    e.preventDefault();
    const btn = $('savePaymentBtn');
    setLoading(btn, true);
    try {
      await saveSetting('payment_chapa_enabled', chk('paymentChapaEnabled'));
      await saveSetting('currency', val('paymentCurrency'));
      await saveSetting('payment_provider', val('paymentProvider'));
      await saveSetting('payment_status_mode', val('paymentStatusMode'));
      showAlert('Payment settings saved');
    } catch (e) { showAlert('Failed to save payment settings: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     5. SECURITY
     ============================================= */
  function populateSecurity(m) {
    $('sessionTimeout').value = m.session_timeout_minutes || 60;
    $('loginMaxAttempts').value = m.login_max_attempts || 5;
    $('adminAccountEnabled').checked = m.admin_account_enabled !== false;
    $('twoFactorEnabled').checked = m.two_factor_enabled === true;
  }

  async function changePassword() {
    const cur = val('currentPassword');
    const nw = val('newPassword');
    const cf = val('confirmPassword');
    if (!cur || !nw) { showAlert('Fill in current and new password', 'error'); return; }
    if (nw.length < 6) { showAlert('New password must be at least 6 characters', 'error'); return; }
    if (nw !== cf) { showAlert('New passwords do not match', 'error'); return; }
    const btn = $('changePasswordBtn');
    setLoading(btn, true);
    try {
      await API().put('/auth/password', { currentPassword: cur, newPassword: nw, confirmPassword: cf });
      $('currentPassword').value = '';
      $('newPassword').value = '';
      $('confirmPassword').value = '';
      showAlert('Password changed successfully');
    } catch (e) { showAlert('Failed to change password: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  async function saveSecurity(e) {
    e.preventDefault();
    const btn = $('saveSecurityBtn');
    setLoading(btn, true);
    try {
      await saveSetting('session_timeout_minutes', num('sessionTimeout', 60));
      await saveSetting('login_max_attempts', num('loginMaxAttempts', 5));
      await saveSetting('admin_account_enabled', chk('adminAccountEnabled'));
      await saveSetting('two_factor_enabled', chk('twoFactorEnabled'));
      showAlert('Security settings saved');
    } catch (e) { showAlert('Failed to save security: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     6. ORDER SETTINGS
     ============================================= */
  function populateOrders(m) {
    $('orderAvailability').checked = m.order_availability !== false;
    $('maintenanceMode').checked = m.maintenance_mode === true;
    $('orderCancellationEnabled').checked = m.order_cancellation_enabled !== false;
    $('cancellationWindow').value = m.cancellation_window_minutes ?? 15;
    $('maxOrderQuantity').value = m.max_order_quantity ?? 10;
    $('minimumOrderAmount').value = m.minimum_order_amount ?? 0;
    $('defaultPreparationTime').value = m.default_preparation_time ?? 15;
  }

  async function saveOrderSettings(e) {
    e.preventDefault();
    const btn = $('saveOrderSettingsBtn');
    setLoading(btn, true);
    try {
      await saveSetting('order_availability', chk('orderAvailability'));
      await saveSetting('maintenance_mode', chk('maintenanceMode'));
      await saveSetting('order_cancellation_enabled', chk('orderCancellationEnabled'));
      await saveSetting('cancellation_window_minutes', num('cancellationWindow', 15));
      await saveSetting('max_order_quantity', num('maxOrderQuantity', 10));
      await saveSetting('minimum_order_amount', num('minimumOrderAmount', 0));
      await saveSetting('default_preparation_time', num('defaultPreparationTime', 15));
      showAlert('Order settings saved');
    } catch (e) { showAlert('Failed to save order settings: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     7. NOTIFICATIONS
     ============================================= */
  function populateNotifications(m) {
    $('notifyNewOrders').checked = m.notify_new_orders !== false;
    $('notifyPayments').checked = m.notify_payments !== false;
    $('notifyLowStock').checked = m.notify_low_stock !== false;
    $('notifyUserAccounts').checked = m.notify_user_accounts === true;
  }

  async function saveNotifications(e) {
    e.preventDefault();
    const btn = $('saveNotificationsBtn');
    setLoading(btn, true);
    try {
      await saveSetting('notify_new_orders', chk('notifyNewOrders'));
      await saveSetting('notify_payments', chk('notifyPayments'));
      await saveSetting('notify_low_stock', chk('notifyLowStock'));
      await saveSetting('notify_user_accounts', chk('notifyUserAccounts'));
      showAlert('Notification settings saved');
    } catch (e) { showAlert('Failed to save notifications: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     8. APPEARANCE
     ============================================= */
  function populateAppearance(m) {
    $('themeSelect').value = m.theme || 'light';
    $('faviconUrl').value = m.favicon_url || '';
    $('appearanceLogoUrl').value = m.appearance_logo_url || '';
    applyTheme(m.theme || 'light');
  }

  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    if (theme === 'dark') document.body.classList.add('theme-dark');
    else document.body.classList.add('theme-light');
    localStorage.setItem('scos_theme', theme);
  }

  async function saveAppearance(e) {
    e.preventDefault();
    const btn = $('saveAppearanceBtn');
    setLoading(btn, true);
    try {
      let logoUrl = val('appearanceLogoUrl');
      const logoFile = $('appearanceLogoFile').files[0];
      if (logoFile) {
        logoUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result);
          r.onerror = rej;
          r.readAsDataURL(logoFile);
        });
      }
      await saveSetting('theme', val('themeSelect'));
      await saveSetting('favicon_url', val('faviconUrl'));
      await saveSetting('appearance_logo_url', logoUrl);
      applyTheme(val('themeSelect'));
      // Apply favicon
      const favEl = document.querySelector('link[rel="icon"]');
      const favUrl = val('faviconUrl');
      if (favEl && favUrl) favEl.href = favUrl;
      showAlert('Appearance settings saved');
    } catch (e) { showAlert('Failed to save appearance: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     IMAGE PREVIEW HELPER
     ============================================= */
  function setupPreview(inputId, rowId, imgId, removeId) {
    const input = $(inputId);
    const row = $(rowId);
    const img = $(imgId);
    const rm = $(removeId);
    if (!input || !row) return;
    input.addEventListener('change', () => {
      const f = input.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => { img.src = ev.target.result; row.style.display = 'flex'; };
      r.readAsDataURL(f);
    });
    if (rm) rm.addEventListener('click', () => { input.value = ''; row.style.display = 'none'; img.src = ''; });
  }

  /* =============================================
     SAVE ALL / RESET
     ============================================= */
  async function saveAllSettings() {
    const btn = $('saveAllSettingsBtn');
    setLoading(btn, true);
    try {
      // Cafeteria
      let logoUrl = val('cafeteriaLogoUrl');
      const logoFile = $('cafeteriaLogoFile').files[0];
      if (logoFile) {
        logoUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result);
          r.onerror = rej;
          r.readAsDataURL(logoFile);
        });
      }
      let appLogoUrl = val('appearanceLogoUrl');
      const appLogoFile = $('appearanceLogoFile').files[0];
      if (appLogoFile) {
        appLogoUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result);
          r.onerror = rej;
          r.readAsDataURL(appLogoFile);
        });
      }
      const all = {
        cafeteria_name: val('cafeteriaName'),
        cafeteria_description: val('cafeteriaDescription'),
        cafeteria_phone: val('cafeteriaPhone'),
        cafeteria_email: val('cafeteriaEmail'),
        cafeteria_address: val('cafeteriaAddress'),
        cafeteria_opening_time: val('cafeteriaOpeningTime'),
        cafeteria_closing_time: val('cafeteriaClosingTime'),
        cafeteria_logo_url: logoUrl,
        default_language: val('defaultLanguage'),
        allow_language_switch: chk('allowLanguageSwitch'),
        payment_chapa_enabled: chk('paymentChapaEnabled'),
        currency: val('paymentCurrency'),
        payment_provider: val('paymentProvider'),
        payment_status_mode: val('paymentStatusMode'),
        session_timeout_minutes: num('sessionTimeout', 60),
        login_max_attempts: num('loginMaxAttempts', 5),
        admin_account_enabled: chk('adminAccountEnabled'),
        two_factor_enabled: chk('twoFactorEnabled'),
        order_availability: chk('orderAvailability'),
        maintenance_mode: chk('maintenanceMode'),
        order_cancellation_enabled: chk('orderCancellationEnabled'),
        cancellation_window_minutes: num('cancellationWindow', 15),
        max_order_quantity: num('maxOrderQuantity', 10),
        minimum_order_amount: num('minimumOrderAmount', 0),
        default_preparation_time: num('defaultPreparationTime', 15),
        notify_new_orders: chk('notifyNewOrders'),
        notify_payments: chk('notifyPayments'),
        notify_low_stock: chk('notifyLowStock'),
        notify_user_accounts: chk('notifyUserAccounts'),
        theme: val('themeSelect'),
        favicon_url: val('faviconUrl'),
        appearance_logo_url: appLogoUrl
      };
      for (const [k, v] of Object.entries(all)) await saveSetting(k, v);
      applyTheme(val('themeSelect'));
      showAlert('All settings saved successfully');
    } catch (e) { showAlert('Failed to save all: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  async function resetSettings() {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) return;
    const btn = $('resetSettingsBtn');
    setLoading(btn, true);
    const defaults = {
      cafeteria_name: 'Smart Cafeteria', cafeteria_description: '', cafeteria_phone: '',
      cafeteria_email: '', cafeteria_address: '', cafeteria_opening_time: '07:00',
      cafeteria_closing_time: '22:00', cafeteria_logo_url: '',
      default_language: 'en', allow_language_switch: true,
      payment_chapa_enabled: true, currency: 'ETB', payment_provider: 'chapa',
      payment_status_mode: 'automatic', session_timeout_minutes: 60,
      login_max_attempts: 5, admin_account_enabled: true, two_factor_enabled: false,
      order_availability: true, maintenance_mode: false, order_cancellation_enabled: true,
      cancellation_window_minutes: 15, max_order_quantity: 10, minimum_order_amount: 0,
      default_preparation_time: 15, notify_new_orders: true, notify_payments: true,
      notify_low_stock: true, notify_user_accounts: false, theme: 'light',
      favicon_url: '', appearance_logo_url: ''
    };
    try {
      for (const [k, v] of Object.entries(defaults)) await saveSetting(k, v);
      // Repopulate all sections
      populateCafeteria(defaults);
      populateLanguage(defaults);
      populatePayment(defaults);
      populateSecurity(defaults);
      populateOrders(defaults);
      populateNotifications(defaults);
      populateAppearance(defaults);
      showAlert('Settings reset to defaults');
    } catch (e) { showAlert('Failed to reset: ' + e.message, 'error'); }
    finally { setLoading(btn, false); }
  }

  /* =============================================
     INIT
     ============================================= */
  async function init() {
    // Bind forms
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

    // Image previews
    setupPreview('cafeteriaLogoFile', 'logoPreviewRow', 'logoPreview', 'removeLogoBtn');
    setupPreview('appearanceLogoFile', 'appearanceLogoPreviewRow', 'appearanceLogoPreview', 'removeAppearanceLogoBtn');

    // Load data
    await loadProfile();
    try {
      const map = await loadSettingsMap();
      populateCafeteria(map);
      populateLanguage(map);
      populatePayment(map);
      populateSecurity(map);
      populateOrders(map);
      populateNotifications(map);
      populateAppearance(map);
    } catch (e) {
      showAlert('Failed to load settings: ' + e.message, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
