/**
 * ==========================================================================
   SMART CAFETERIA ADMIN — SHARED LAYOUT MODULE
   ==========================================================================
   Provides common layout rendering for all admin pages.
   Load this BEFORE page-specific admin scripts.
   ========================================================================== */
(function () {
  'use strict';

  // Admin page definitions for sidebar
  var ADMIN_PAGES = [
    { id: 'dashboard', path: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard', group: 'main' },
    { id: 'users', path: 'users.html', icon: 'fa-users', label: 'Users', group: 'management' },
    { id: 'menu', path: 'menu.html', icon: 'fa-bowl-food', label: 'Menu / Foods', group: 'management' },
    { id: 'categories', path: 'categories.html', icon: 'fa-list', label: 'Categories', group: 'management' },
    { id: 'orders', path: 'orders.html', icon: 'fa-receipt', label: 'Orders', group: 'management' },
    { id: 'payments', path: 'payments.html', icon: 'fa-wallet', label: 'Payments', group: 'management' },
    { id: 'cancellations', path: 'cancellations.html', icon: 'fa-hand-holding-dollar', label: 'Cancellations', group: 'management' },
    { id: 'feedback', path: 'feedback.html', icon: 'fa-comment-dots', label: 'Feedback', group: 'management' },
    { id: 'reports', path: 'reports.html', icon: 'fa-file-invoice-dollar', label: 'Reports', group: 'analytics' },
    { id: 'activity', path: 'activity.html', icon: 'fa-list-check', label: 'Activity Logs', group: 'analytics' },
    { id: 'settings', path: 'settings.html', icon: 'fa-gear', label: 'Settings', group: 'system' }
  ];

  var SIDEBAR_GROUPS = [
    { id: 'main', label: 'MAIN', pages: ['dashboard'] },
    { id: 'management', label: 'MANAGEMENT', pages: ['users', 'menu', 'categories', 'orders', 'payments', 'cancellations', 'feedback'] },
    { id: 'analytics', label: 'ANALYTICS & REPORTS', pages: ['reports', 'activity'] },
    { id: 'system', label: 'SYSTEM', pages: ['settings'] }
  ];

  // Current page detection
  function getCurrentPageId() {
    var path = window.location.pathname.split('/').pop().replace('.html', '');
    return path || 'dashboard';
  }

  // Render sidebar navigation
  function renderSidebar(currentPageId) {
    var sidebar = document.getElementById('adminSidebar');
    if (!sidebar) return;

    function t(key, fallback) {
      try {
        if (window.getText) { var v = window.getText(key); if (v !== key) return v; }
        if (window.translations) {
          var lang = localStorage.getItem('scos_language') || localStorage.getItem('cafeteria_language') || 'en';
          if (window.translations[lang] && window.translations[lang][key]) return window.translations[lang][key];
        }
      } catch(e){}
      return fallback;
    }

    var html = '<nav class="sidebar-nav">';

    SIDEBAR_GROUPS.forEach(function(group) {
      html += '<div class="sidebar-group">';

      group.pages.forEach(function(pageId) {
        var page = ADMIN_PAGES.find(function(p) { return p.id === pageId; });
        if (!page) return;

        var labelKeyMap = { dashboard: 'admin_dashboard', users: 'admin_users', menu: 'admin_menu', categories: 'admin_categories', orders: 'admin_orders', payments: 'admin_payments', cancellations: 'admin_cancellations', reports: 'admin_reports', activity: 'admin_activity', settings: 'admin_settings' };
        var translatedLabel = t(labelKeyMap[pageId] || pageId, page.label);
        var isActive = pageId === currentPageId;
        html += '<a href="' + page.path + '" class="sidebar-link' + (isActive ? ' active' : '') + '"';
        if (pageId === 'cancellations') {
          html += ' id="sidebarCancellationLink"';
        }
        html += '>';
        html += '<i class="fa-solid ' + page.icon + '"></i>';
        html += '<span>' + translatedLabel + '</span>';
        if (pageId === 'cancellations') {
          html += '<span class="sidebar-badge" id="sidebarRefundBadge">0</span>';
        }
        html += '</a>';
      });

      html += '</div>';
    });

    html += '</nav>';
    sidebar.innerHTML = html;

    // Bind other events if any
  }

    // Ensure unified i18n is loaded on admin pages (auto-inject if missing)
    function ensureI18nLoaded() {
    if (document.querySelector('script[src*="i18n.js"]')) return;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = '../../js/utils/i18n.js';
    document.head.appendChild(s);
  }

  // Ensure theme.js is loaded on all admin pages
  function ensureThemeLoaded() {
    if (document.querySelector('script[src*="theme.js"]')) return;
    var s = document.createElement('script');
    s.src = '../../js/theme.js';
    document.head.appendChild(s);
  }

  // Ensure the dark theme stylesheet is loaded so admin surfaces re-theme.
  function ensureDarkThemeCssLoaded() {
    if (document.querySelector('link[href*="dark-theme.css"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '../../css/themes/dark-theme.css';
    document.head.appendChild(l);
  }

  // Render top navbar
  function renderNavbar() {
    var navbar = document.querySelector('.admin-navbar');
    if (!navbar) return;

    ensureI18nLoaded();

    var profile = getStoredProfile();
    var avatarLetter = profile && profile.name ? profile.name.charAt(0).toUpperCase() : 'A';
    var adminName = profile && profile.name ? profile.name : 'Admin User';

    var curLang = 'en';
    try { curLang = localStorage.getItem('scos_language') || localStorage.getItem('cafeteria_language') || 'en'; if (curLang !== 'am') curLang = 'en'; } catch(e){}
    navbar.innerHTML = ''
      + '<div class="nav-left">'
      + '  <button id="sidebarToggle" class="btn-icon" aria-label="Toggle Sidebar"><i class="fa-solid fa-bars"></i></button>'
      + '  <a href="dashboard.html" class="brand-logo"><i class="fa-solid fa-utensils"></i><span>Smart Cafeteria <small>Admin</small></span></a>'
      + '</div>'
      + '<div class="nav-right">'
      + '  <div class="lang-switcher-widget" style="display:inline-flex;align-items:center;gap:6px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:3px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-right:8px;">'
      + '    <i class="fa-solid fa-globe" style="color:#2563eb;font-size:13px;"></i>'
      + '    <select class="scos-lang-select" aria-label="Language Selector" style="background:transparent;color:#0f172a;border:none;font-weight:700;cursor:pointer;font-size:13px;outline:none;min-width:110px;">'
      + '      <option value="en"' + (curLang==='en'?' selected':'') + '>🇬🇧 English</option>'
      + '      <option value="am"' + (curLang==='am'?' selected':'') + '>🇪🇹 አማርኛ</option>'
      + '    </select>'
      + '  </div>'
      + '  <div class="nav-item dropdown">'
      + '    <button class="btn-icon notification-btn" id="notificationBtn" title="Notifications"><i class="fa-solid fa-bell"></i><span class="badge-dot" id="notifBadge"></span></button>'
      + '  </div>'
      + '  <button type="button" class="btn-icon theme-toggle" id="themeToggle" title="Toggle Theme">'
      + '    <i class="fa-solid fa-moon"></i>'
      + '  </button>'
      + '  <div class="user-profile-menu">'
      + '    <div class="avatar" id="adminAvatar">' + avatarLetter + '</div>'
      + '    <div class="user-info">'
      + '      <strong id="adminNameDisplay">' + adminName + '</strong>'
      + '      <small>Administrator</small>'
      + '    </div>'
      + '    <button id="logoutBtn" class="btn-logout-icon" title="Logout"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></button>'
      + '  </div>'
      + '</div>';

    // Bind language switcher - immediate without refresh, persisted in localStorage
    var langSelect = navbar.querySelector('.scos-lang-select');
    if (langSelect) {
      try { langSelect.value = curLang; } catch(e){}
      if (!langSelect.dataset.i18nBound) {
        langSelect.dataset.i18nBound = '1';
        langSelect.addEventListener('change', function(e) {
          var lang = e.target.value;
          if (window.setLanguage) window.setLanguage(lang);
          else { try { localStorage.setItem('scos_language', lang); localStorage.setItem('cafeteria_language', lang); } catch(_){} if (window.applyTranslations) window.applyTranslations(); }
        });
      }
    }
    if (window.applyTranslations) setTimeout(function(){ window.applyTranslations(); }, 0);

    // Wire theme toggle + sync its icon (theme.js owns the click handler to
    // avoid double-toggling; refresh() binds/syncs dynamically-injected headers)
    if (window.ScosTheme) {
      try { window.ScosTheme.refresh(); } catch(e) {}
    }

    // Attach sidebar toggle
    var sidebarToggle = document.getElementById('sidebarToggle');
    var sidebar = document.getElementById('adminSidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function() {
        // Desktop: collapse/expand the sidebar (icon rail). Mobile: slide it in.
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

    // Close sidebar on backdrop click
    document.addEventListener('click', function(e) {
      var backdrop = document.querySelector('.sidebar-backdrop');
      if (backdrop && backdrop.classList.contains('open') && !sidebar.contains(e.target) && !document.getElementById('sidebarToggle').contains(e.target)) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
      }
    });

    // Close sidebar on link click (mobile)
    document.addEventListener('click', function(e) {
      var link = e.target.closest('.sidebar-link');
      if (link && window.innerWidth < 992) {
        sidebar.classList.remove('open');
        var backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('open');
      }
    });

    // Logout handler
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        if (window.confirm('Are you sure you want to log out?')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('role');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('current_user');
          localStorage.removeItem('userName');
          localStorage.removeItem('name');
          window.location.href = '../../pages/common/login.html';
        }
      });
    }

    // Notification button (placeholder)
    var notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', function() {
        if (window.AdminToast) window.AdminToast.info('Notifications coming soon');
      });
    }

  }

  // Auth guard + profile population
  function initAuthGuard() {
    var userRole = (localStorage.getItem('userRole') || '').toLowerCase();
    var role = (localStorage.getItem('role') || '').toLowerCase();
    var allowedRoles = ['admin', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'];
    if (!userRole && !role) {
      window.location.href = '../../pages/common/login.html';
      return false;
    }
    if (!allowedRoles.includes(userRole) && !allowedRoles.includes(role)) {
      window.location.href = '../../pages/common/login.html';
      return false;
    }

    var profile = getStoredProfile();
    if (profile) {
      var nameDisplay = document.getElementById('adminNameDisplay');
      var avatar = document.getElementById('adminAvatar');
      if (nameDisplay) nameDisplay.textContent = profile.name || 'Admin User';
      if (avatar && profile.name) avatar.textContent = profile.name.charAt(0).toUpperCase();
    } else {
      var nameDisplay = document.getElementById('adminNameDisplay');
      if (nameDisplay) nameDisplay.textContent = 'Admin User';
    }
    return true;
  }

  function getStoredProfile() {
    try {
      var raw = localStorage.getItem('userProfile') || localStorage.getItem('user') || localStorage.getItem('loggedUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // Initialize everything on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // 1. Auth guard
    if (!initAuthGuard()) return;

    // 2. Load theme module
    ensureThemeLoaded();
    ensureDarkThemeCssLoaded();

    // 3. Render layout
    renderNavbar();
    renderSidebar(getCurrentPageId());

    // 4. Initialize tooltips, etc.
    if (typeof initPageSpecific === 'function') {
      initPageSpecific();
    }
  });

  // Expose utilities globally
  window.AdminLayout = {
    renderSidebar: renderSidebar,
    renderNavbar: renderNavbar,
    getCurrentPageId: getCurrentPageId,
    getStoredProfile: getStoredProfile
  };
})();