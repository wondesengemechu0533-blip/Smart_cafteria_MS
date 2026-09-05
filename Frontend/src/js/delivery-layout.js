/**
 * ==========================================================================
   SMART CAFETERIA DELIVERY STAFF — SHARED LAYOUT MODULE
   ==========================================================================
   Provides the common sidebar + top nav bar for all delivery staff pages.
   Load this BEFORE page-specific delivery scripts.

   Sidebar sections:
     MAIN:       Dashboard
     DELIVERIES: Active Deliveries, My History
     ACCOUNT:    Notifications, Profile
   ========================================================================== */
(function () {
  'use strict';

  var DELIVERY_PAGES = [
    { id: 'dashboard', path: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard', group: 'main' },
    { id: 'deliveries', path: 'deliveries.html', icon: 'fa-truck-fast', label: 'Active Deliveries', group: 'operations' },
    { id: 'history', path: 'history.html', icon: 'fa-clock-rotate-left', label: 'My History', group: 'operations' },
    { id: 'notifications', path: 'notifications.html', icon: 'fa-bell', label: 'Notifications', group: 'account' },
    { id: 'profile', path: 'profile.html', icon: 'fa-user', label: 'Profile', group: 'account' }
  ];

  var SIDEBAR_GROUPS = [
    { id: 'main', label: 'MAIN', labelKey: 'delivery_main', pages: ['dashboard'] },
    { id: 'operations', label: 'DELIVERIES', labelKey: 'delivery_operations', pages: ['deliveries', 'history'] },
    { id: 'account', label: 'ACCOUNT', labelKey: 'delivery_account', pages: ['notifications', 'profile'] }
  ];

  var LABEL_KEYS = {
    dashboard: 'delivery_dashboard',
    deliveries: 'delivery_active_deliveries',
    history: 'delivery_history',
    notifications: 'delivery_notifications',
    profile: 'delivery_profile'
  };

  // Current page detection
  function getCurrentPageId() {
    var path = window.location.pathname.split('/').pop().replace('.html', '');
    return path || 'dashboard';
  }

  // Translate helper (falls back to English label)
  function t(key, fallback) {
    try {
      var v = (window.t || window.getText) && (window.t || window.getText)(key);
      if (v && v !== key) return v;
    } catch (e) {}
    return fallback;
  }

  // Render sidebar navigation
  function renderSidebar(currentPageId) {
    var sidebar = document.getElementById('deliverySidebar');
    if (!sidebar) return;

    var html = '';

    // Brand block (top of sidebar)
    html += '<div class="sidebar-brand">'
      + '<i class="fa-solid fa-truck-fast"></i>'
      + '<span data-i18n="delivery_brand">' + t('delivery_brand', 'Smart Cafeteria') + '</span>'
      + '</div>';

    html += '<nav class="sidebar-nav">';
    SIDEBAR_GROUPS.forEach(function (group) {
      var groupTitle = t(group.labelKey, group.label);
      html += '<div class="sidebar-group">';
      html += '<div class="sidebar-group-title" data-i18n="' + group.labelKey + '">' + groupTitle + '</div>';
      group.pages.forEach(function (pageId) {
        var page = DELIVERY_PAGES.find(function (p) { return p.id === pageId; });
        if (!page) return;
        var isActive = pageId === currentPageId;
        html += '<a href="' + page.path + '" class="sidebar-link' + (isActive ? ' active' : '') + '">'
          + '<i class="fa-solid ' + page.icon + '"></i>'
          + '<span data-i18n="' + (LABEL_KEYS[pageId] || pageId) + '">' + t(LABEL_KEYS[pageId] || pageId, page.label) + '</span>'
          + '</a>';
      });
      html += '</div>';
    });
    html += '</nav>';

    sidebar.innerHTML = html;
  }

  // Ensure theme + i18n helpers are available
  function ensureThemeLoaded() {
    if (document.querySelector('script[src*="theme.js"]')) return;
    var s = document.createElement('script');
    s.src = '../../js/theme.js';
    document.head.appendChild(s);
  }

  function ensureDarkThemeCssLoaded() {
    if (document.querySelector('link[href*="dark-theme.css"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '../../css/themes/dark-theme.css';
    document.head.appendChild(l);
  }

  // Refresh the unread notification badge on the bell button
  function refreshNotificationBadge() {
    var badge = document.getElementById('notifBadge');
    if (!badge) return;
    var token = localStorage.getItem('auth_token');
    if (!token) { badge.textContent = ''; return; }
    fetch((window.__API_URL || '') + '/notifications/unread', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var count = data && data.count ? Number(data.count) : 0;
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      })
      .catch(function () { badge.style.display = 'none'; });
  }

  // Render top navbar
  function renderNavbar() {
    var navbar = document.querySelector('.admin-navbar');
    if (!navbar) return;

    var profile = getStoredProfile();
    var avatarLetter = profile && profile.name ? profile.name.charAt(0).toUpperCase() : 'D';
    var avatarHtml = (profile && profile.avatar)
      ? '<img src="' + profile.avatar + '" alt="Avatar" class="navbar-avatar-img">'
      : avatarLetter;
    var staffName = profile && profile.name ? profile.name : 'Delivery Staff';

    var curLang = 'en';
    try { curLang = localStorage.getItem('scos_language') || localStorage.getItem('cafeteria_language') || 'en'; if (curLang !== 'am') curLang = 'en'; } catch (e) {}

    var brandText = t('delivery_brand', 'Smart Cafeteria');
    var brandRoleText = t('delivery_brand_delivery', 'Delivery');
    var roleText = t('delivery_role', 'Delivery Staff');

    navbar.innerHTML = ''
      + '<div class="nav-left">'
      + '  <button id="sidebarToggle" class="btn-icon" aria-label="Toggle Sidebar"><i class="fa-solid fa-bars"></i></button>'
      + '  <a href="dashboard.html" class="brand-logo"><i class="fa-solid fa-truck-fast"></i><span>' + brandText + ' <small>' + brandRoleText + '</small></span></a>'
      + '</div>'
      + '<div class="nav-right">'
      + '  <div class="lang-switcher-widget" style="display:inline-flex;align-items:center;gap:6px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:3px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-right:8px;">'
      + '    <i class="fa-solid fa-globe" style="color:#2563eb;font-size:13px;"></i>'
      + '    <select class="scos-lang-select" aria-label="Language Selector" style="background:transparent;color:#0f172a;border:none;font-weight:700;cursor:pointer;font-size:13px;outline:none;min-width:110px;">'
      + '      <option value="en"' + (curLang === 'en' ? ' selected' : '') + '>🇬🇧 English</option>'
      + '      <option value="am"' + (curLang === 'am' ? ' selected' : '') + '>🇪🇹 አማርኛ</option>'
      + '    </select>'
      + '  </div>'
      + '  <a href="notifications.html" class="btn-icon notification-btn" id="notificationBtn" title="' + t('delivery_notifications', 'Notifications') + '">'
      + '    <i class="fa-solid fa-bell"></i><span class="badge-dot" id="notifBadge"></span>'
      + '  </a>'
      + '  <button type="button" class="btn-icon theme-toggle" id="themeToggle" title="Toggle Theme">'
      + '    <i class="fa-solid fa-moon"></i>'
      + '  </button>'
      + '  <div class="user-profile-menu">'
      + '    <div class="avatar" id="deliveryAvatar">' + avatarHtml + '</div>'
      + '    <div class="user-info">'
      + '      <strong id="deliveryNameDisplay">' + staffName + '</strong>'
      + '      <small data-i18n="delivery_role">' + roleText + '</small>'
      + '    </div>'
      + '    <button id="logoutBtn" class="btn-logout-icon" title="' + t('delivery_logout', 'Logout') + '"><i class="fa-solid fa-right-from-bracket"></i><span data-i18n="delivery_logout">' + t('delivery_logout', 'Logout') + '</span></button>'
      + '  </div>'
      + '</div>';

    // Bind language switcher - immediate without refresh, persisted in localStorage
    var langSelect = navbar.querySelector('.scos-lang-select');
    if (langSelect) {
      try { langSelect.value = curLang; } catch (e) {}
      if (!langSelect.dataset.i18nBound) {
        langSelect.dataset.i18nBound = '1';
        langSelect.addEventListener('change', function (e) {
          var lang = e.target.value;
          if (window.setLanguage) window.setLanguage(lang);
          else { try { localStorage.setItem('scos_language', lang); localStorage.setItem('cafeteria_language', lang); } catch (_) {} if (window.applyTranslations) window.applyTranslations(); }
        });
      }
    }
    if (window.applyTranslations) setTimeout(function () { window.applyTranslations(); }, 0);

    // Wire theme toggle + sync its icon
    if (window.ScosTheme) {
      try { window.ScosTheme.refresh(); } catch (e) {}
    }

    // Sidebar toggle (collapse on desktop, off-canvas on mobile)
    var sidebarToggle = document.getElementById('sidebarToggle');
    var sidebar = document.getElementById('deliverySidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function () {
        if (window.innerWidth > 992) {
          sidebar.classList.toggle('collapsed');
          return;
        }
        sidebar.classList.toggle('open');
        var backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
          backdrop = document.createElement('div');
          backdrop.className = 'sidebar-backdrop';
          document.body.appendChild(backdrop);
        }
        backdrop.classList.toggle('open', sidebar.classList.contains('open'));
      });
    }

    document.addEventListener('click', function (e) {
      var backdrop = document.querySelector('.sidebar-backdrop');
      if (backdrop && backdrop.classList.contains('open') && !sidebar.contains(e.target) && !document.getElementById('sidebarToggle').contains(e.target)) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
      }
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('.sidebar-link');
      if (link && window.innerWidth < 992) {
        sidebar.classList.remove('open');
        var backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('open');
      }
    });

    // Logout handler - clears the whole session then goes to login
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        if (window.confirm('Are you sure you want to log out?')) {
          ['auth_token', 'userRole', 'role', 'userProfile', 'current_user', 'userName', 'name', 'isLoggedIn', 'deliveryLoggedIn', 'adminLoggedIn', 'kitchenLoggedIn', 'customerLoggedIn'].forEach(function (k) {
            localStorage.removeItem(k);
          });
          window.location.href = '../common/login.html';
        }
      });
    }

    refreshNotificationBadge();
    setupUnreadPolling();
  }

  // Poll the unread badge every 30s + refresh on realtime notification events
  function setupUnreadPolling() {
    window.setInterval(refreshNotificationBadge, 30000);
    document.addEventListener('notification:refresh', refreshNotificationBadge);
    try {
      window.refreshNotificationBadge = refreshNotificationBadge;
    } catch (e) {}
  }

  // Auth guard + profile population
  function initAuthGuard() {
    var userRole = (localStorage.getItem('userRole') || localStorage.getItem('role') || '').toLowerCase();
    if (!userRole) {
      window.location.href = '../common/login.html';
      return false;
    }
    var allowedRoles = ['delivery', 'delivery_staff', 'delivery staff', 'driver', 'rider', 'admin', 'administrator'];
    if (!allowedRoles.includes(userRole)) {
      window.location.href = '../common/login.html';
      return false;
    }

    var profile = getStoredProfile();
    if (profile) {
      var nameDisplay = document.getElementById('deliveryNameDisplay');
      var avatar = document.getElementById('deliveryAvatar');
      if (nameDisplay) nameDisplay.textContent = profile.name || 'Delivery Staff';
      if (avatar) {
        if (profile.avatar) {
          avatar.innerHTML = '<img src="' + profile.avatar + '" alt="Avatar" class="navbar-avatar-img">';
        } else if (profile.name) {
          avatar.textContent = profile.name.charAt(0).toUpperCase();
        }
      }
    }
    return true;
  }

  function getStoredProfile() {
    try {
      var raw = localStorage.getItem('userProfile') || localStorage.getItem('current_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // Initialize everything on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    if (!initAuthGuard()) return;

    ensureThemeLoaded();
    ensureDarkThemeCssLoaded();

    renderNavbar();
    renderSidebar(getCurrentPageId());

    // Re-render layout when the active language changes
    function reRenderOnLangChange() {
      renderNavbar();
      renderSidebar(getCurrentPageId());
    }
    if (typeof window.onLanguageChange === 'function') {
      window.onLanguageChange(reRenderOnLangChange);
    } else {
      window.addEventListener('language:changed', reRenderOnLangChange);
      window.addEventListener('languageChanged', reRenderOnLangChange);
    }

    if (typeof initPageSpecific === 'function') {
      initPageSpecific();
    }
  });

  // Expose utilities globally
  window.DeliveryLayout = {
    renderSidebar: renderSidebar,
    renderNavbar: renderNavbar,
    getCurrentPageId: getCurrentPageId,
    getStoredProfile: getStoredProfile,
    refreshNotificationBadge: refreshNotificationBadge
  };
})();