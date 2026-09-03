/**
 * ================================================================
 * SMART CAFETERIA - UNIFIED HEADER ENHANCER
 * ================================================================
 * Normalises the top-right controls of the customer and kitchen
 * navigation bars so they match the admin header. It attaches the
 * missing notification bell to each page's existing header while
 * preserving page-specific items (cart, search, back buttons, etc.).
 *
 * The language switcher is injected centrally by js/utils/i18n.js
 * (ensureSwitcherInjected), and the theme toggle is handled by
 * js/theme.js, so this module only adds the notification bell and
 * makes sure logout clears the session — matching the admin top bar.
 *
 * Include this module (type="module") on any customer/kitchen page:
 *   <script type="module" src="../../js/components/unified-header.js"></script>
 * ================================================================
 */
(function () {
  'use strict';

  // First matching container is used as the "top-right actions" host.
  var ACTION_SELECTORS = [
    '.kds-header .user-menu',          // kitchen kds-header
    '.navbar-header .header-actions',  // customer navbar-header pages
    '.navbar .nav-links',              // customer simple navbar pages
    '.navbar .user-nav-links',
    '.navbar .container > div:last-child' // checkout inline action div
  ];

  function buildNotificationBell() {
    var bell = document.createElement('a');
    bell.className = 'unified-notif notification-btn';
    bell.href = 'notifications.html';
    bell.title = 'Notifications';
    bell.setAttribute('aria-label', 'Notifications');
    bell.innerHTML =
      '<i class="fa-solid fa-bell"></i>' +
      '<span class="badge-dot unified-notif-dot" style="display:none;"></span>';
    return bell;
  }

  function findActionHost() {
    for (var i = 0; i < ACTION_SELECTORS.length; i++) {
      var el = document.querySelector(ACTION_SELECTORS[i]);
      if (el) return el;
    }
    return null;
  }

  function prependBell(host) {
    if (host.querySelector('.unified-notif')) return;
    host.insertBefore(buildNotificationBell(), host.firstChild);
  }

  function ensureLogoutClearsSession() {
    document.querySelectorAll('a.nav-logout, a.logout, a.logout-link, a.logout-btn, .kds-logout-btn').forEach(function (anchor) {
      if (anchor.dataset.unifiedBound) return;
      anchor.dataset.unifiedBound = '1';
      anchor.addEventListener('click', function () {
        try {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('role');
          localStorage.removeItem('userName');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('adminLoggedIn');
        } catch (err) {}
      });
    });
  }

  function init() {
    var host = findActionHost();
    if (host) prependBell(host);
    ensureLogoutClearsSession();
    if (window.ScosTheme) {
      try { window.ScosTheme.refresh(); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.UnifiedHeader = { init: init };
})();