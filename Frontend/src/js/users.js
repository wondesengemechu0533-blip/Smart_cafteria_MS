/**
 * ================================================================
 * SMART CAFETERIA ORDERING SYSTEM - USER MANAGEMENT
 * ================================================================
 * Admin User Management driven by the backend API:
 *   GET    /admin/users            (list/search/filter/paginate)
 *   GET    /admin/users/:id        (details)
 *   GET    /admin/users/stats      (statistics)
 *   POST   /admin/users            (create)
 *   PUT    /admin/users/:id        (update)
 *   PATCH  /admin/users/:id/status (activate / deactivate / suspend)
 *   PATCH  /admin/users/:id/role   (assign role)
 *   PATCH  /admin/users/:id/password (reset password)
 *   DELETE /admin/users/:id        (soft-delete / deactivate)
 *
 * Requires window.AdminAPI (admin-api.js) loaded first.
 * ================================================================
 */
(function () {
  "use strict";

  var state = {
    page: 1,
    limit: 10,
    search: "",
    role: "",
    status: "",
    total: 0,
    pages: 1
  };

  /* ---- Role helpers ---- */
  var ROLE_LABELS = {
    customer: { en: "Customer", am: "ተጠቃሚ", om: "Maaldaa" },
    kitchen:  { en: "Kitchen Staff / Food Maker", am: "የኩሽና ሰራተኛ / ምግብ አዘጋጅ", om: "Hojjettaa Mana Caccabsaa" },
    admin:    { en: "Admin", am: "አስተዳዳሪ", om: "Haadhaa" }
  };

  var STATUS_LABELS = {
    ACTIVE:    { en: "Active",   am: "ንቁ",     om: "Naqqa" },
    BLOCKED:   { en: "Blocked",  am: "ተቋርጧል", om: "Cufame" },
    SUSPENDED: { en: "Suspended", am: "ተinee十余", om: "Hakiinamaa" }
  };

  function getLang() {
    try {
      return (window.getCurrentLanguage && window.getCurrentLanguage()) || localStorage.getItem("scos_language") || localStorage.getItem("cafeteria_language") || "en";
    } catch (e) { return "en"; }
  }

  function t(key) {
    try {
      if (window.getText) {
        var v = window.getText(key);
        if (v !== key) return v;
      }
    } catch (e) {}
    return key;
  }

  function roleLabel(role) {
    var labels = ROLE_LABELS[role];
    if (!labels) return role || "\u2014";
    return labels[getLang()] || labels.en || role;
  }

  function statusLabel(status) {
    var labels = STATUS_LABELS[status];
    if (!labels) return status || "\u2014";
    return labels[getLang()] || labels.en || status;
  }

  function currentAdminId() {
    try {
      var token = window.AdminAPI.getToken();
      if (!token) return null;
      var payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.id || null;
    } catch (e) { return null; }
  }

  var adminId = currentAdminId();

  /* ---- Display helpers ---- */
  function money(value) {
    if (value === null || value === undefined) return "0";
    return Number(value).toLocaleString("en-US");
  }

  function rolePill(role) {
    var cls = "role-pill";
    var r = String(role || "").toUpperCase();
    if (r === "ADMIN") cls += " role-admin";
    else if (r === "KITCHEN") cls += " role-kitchen";
    else cls += " role-customer";
    return '<span class="' + cls + '">' + esc(roleLabel(role)) + "</span>";
  }

  function statusPill(status, isActive) {
    var s = String(status || "ACTIVE").toUpperCase();
    var cls = "order-badge";
    if (s === "ACTIVE" && isActive !== false) cls += " active-badge";
    else if (s === "SUSPENDED") cls += " suspended-badge";
    else cls += " blocked-badge";
    return '<span class="' + cls + '">' + esc(statusLabel(status)) + "</span>";
  }

  function esc(str) {
    return window.esc ? window.esc(str) : String(str || "");
  }

  function avatarInitial(name) {
    return (name && name.charAt(0).toUpperCase()) || "U";
  }

  function formatDate(v) { return window.AdminAPI.formatDate(v); }
  function formatDateTime(v) { return window.AdminAPI.formatDateTime(v); }

  /* ============================================================
   * MODALS
   * ============================================================ */
  function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("open");
  }
  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }
  function closeAllModals() {
    document.querySelectorAll(".modal-overlay.open").forEach(function (m) { m.classList.remove("open"); });
  }

  /* ============================================================
   * DATA LOADING
   * ============================================================ */
  async function loadStats() {
    try {
      var data = await window.AdminAPI.get("/admin/users/stats");
      var stats = data.stats || {};
      var el1 = document.getElementById("metricTotalUsers");
      var el2 = document.getElementById("metricActiveCustomers");
      var el3 = document.getElementById("metricStaff");
      var el4 = document.getElementById("metricBlockedUsers");
      if (el1) el1.textContent = stats.totalUsers || 0;
      if (el2) el2.textContent = stats.activeCustomers || 0;
      if (el3) el3.textContent = stats.staffCount || 0;
      if (el4) el4.textContent = stats.blockedCount || 0;
    } catch (e) {
      // stats are supplementary; ignore failures
    }
  }

  async function loadUsers() {
    var tbody = document.getElementById("usersTableBody");
    if (!tbody || !window.AdminAPI) return;

    tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-spinner fa-spin"></i> ' + esc(t("loading")) + "...</td></tr>";

    try {
      var data = await window.AdminAPI.get("/admin/users", {
        page: state.page,
        limit: state.limit,
        search: state.search,
        role: state.role,
        status: state.status
      });

      state.total = data.total || 0;
      state.pages = data.pages || Math.max(Math.ceil(state.total / state.limit), 1);
      window.__usersCache = data.users || [];
      renderUsers(window.__usersCache);
      renderPagination();
    } catch (error) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-circle-exclamation"></i> ' + esc(error.message || "Server error") + "</td></tr>";
    }
  }

  function renderUsers(users) {
    var tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-users"></i> ' + esc(t("no_data")) + "</td></tr>";
      return;
    }

    tbody.innerHTML = users.map(function (u) {
      var initials = avatarInitial(u.name);
      var name = esc(u.name || "\u2014");
      var email = esc(u.email || "\u2014");
      var phone = esc(u.phone || "\u2014");
      var isSelf = u.id === adminId;
      var isLastAdmin = false;
      var isActive = u.status === "ACTIVE" && u.isActive !== false;
      var isSuspended = String(u.status).toUpperCase() === "SUSPENDED";

      var toggleBtn = isSelf
        ? '<button class="action-btn" title="' + esc(t("cannot_deactivate_own")) + '" disabled><i class="fa-solid fa-lock"></i></button>'
        : '<button class="action-btn" data-action="toggle" data-id="' + u.id + '" title="' + (isActive ? esc(t("deactivate")) : esc(t("activate"))) + '">' +
          '<i class="fa-solid ' + (isActive ? "fa-user-slash" : "fa-user-check") + '"></i></button>';

      return (
        '<tr' + (!isActive ? ' class="row-inactive"' : "") + '>' +
        '<td>' +
          '<div class="user-cell">' +
            '<div class="user-avatar">' + initials + "</div>" +
            "<div>" +
              "<strong>" + name + "</strong>" +
              "<small>" + email + "</small>" +
              (phone !== "\u2014" ? '<small class="text-muted">' + phone + "</small>" : "") +
            "</div>" +
          "</div>" +
        "</td>" +
        '<td>' + rolePill(u.role) + "</td>" +
        '<td>' + money(u.balance) + " ETB</td>" +
        '<td>' + statusPill(u.status, u.isActive) + "</td>" +
        "<td>" + formatDate(u.createdAt) + "</td>" +
        "<td>" +
          '<div class="table-actions">' +
            '<button class="action-btn" data-action="view" data-id="' + u.id + '" title="' + esc(t("view_details")) + '"><i class="fa-solid fa-eye"></i></button>' +
            '<button class="action-btn" data-action="edit" data-id="' + u.id + '" title="' + esc(t("edit")) + '"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="action-btn" data-action="role" data-id="' + u.id + '" title="' + esc(t("change_role")) + '"><i class="fa-solid fa-id-card"></i></button>' +
            '<button class="action-btn" data-action="password" data-id="' + u.id + '" title="' + esc(t("reset_password")) + '"><i class="fa-solid fa-key"></i></button>' +
            toggleBtn +
            '<button class="action-btn danger" data-action="delete" data-id="' + u.id + '" title="' + esc(t("delete")) + '"><i class="fa-solid fa-trash"></i></button>' +
          "</div>" +
        "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderPagination() {
    var info = document.getElementById("paginationInfo");
    var prevBtn = document.getElementById("prevPageBtn");
    var nextBtn = document.getElementById("nextPageBtn");

    if (info) info.textContent = t("page_info").replace("{page}", state.page).replace("{pages}", Math.max(state.pages, 1)).replace("{total}", state.total);
    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= state.pages;
  }

  function changePage(delta) {
    state.page = Math.min(Math.max(state.page + delta, 1), Math.max(state.pages, 1));
    loadUsers();
  }

  /* ============================================================
   * ADD / EDIT USER
   * ============================================================ */
  function openAddUserModal() {
    closeAllModals();
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    document.getElementById("modalTitle").textContent = t("add_user");
    document.getElementById("saveUserBtn").textContent = t("save");
    document.getElementById("passwordLabel").textContent = t("password") + " *";
    document.getElementById("userPassword").required = true;
    document.getElementById("userPassword").value = "";
    document.getElementById("userBalance").value = 0;
    openModal("userModal");
  }

  function openEditUserModal(user) {
    closeAllModals();
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = user.id;
    document.getElementById("userName").value = user.name || "";
    document.getElementById("userEmail").value = user.email || "";
    document.getElementById("userPhone").value = user.phone || "";
    document.getElementById("userRole").value = user.role === "customer" ? "kitchen" : (user.role || "kitchen");
    document.getElementById("userBalance").value = user.balance || 0;
    document.getElementById("modalTitle").textContent = t("edit_user");
    document.getElementById("saveUserBtn").textContent = t("update");
    document.getElementById("passwordLabel").textContent = t("new_password_optional");
    document.getElementById("userPassword").required = false;
    document.getElementById("userPassword").value = "";
    openModal("userModal");
  }

  function buildUserPayload() {
    return {
      name: document.getElementById("userName").value.trim(),
      email: document.getElementById("userEmail").value.trim(),
      phone: document.getElementById("userPhone").value.trim(),
      role: document.getElementById("userRole").value,
      balance: parseFloat(document.getElementById("userBalance").value) || 0,
      password: document.getElementById("userPassword").value
    };
  }

  async function handleUserFormSubmit(event) {
    event.preventDefault();

    var id = document.getElementById("userId").value;
    var payload = buildUserPayload();
    if (!id && !payload.email) return;

    var submitBtn = document.getElementById("saveUserBtn");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.originalText = submitBtn.textContent; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + t("saving") + "..."; }

    try {
      if (!id) {
        if (!payload.password) {
          if (window.AdminToast) window.AdminToast.error(t("password_required_new"));
          return;
        }
        await window.AdminAPI.post("/admin/users", payload);
      } else {
        var updatePayload = {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          balance: payload.balance
        };
        if (payload.password) updatePayload.password = payload.password;
        await window.AdminAPI.put("/admin/users/" + id, updatePayload);
      }

      closeModal("userModal");
      if (window.AdminToast) window.AdminToast.success(t("user_saved"));
      loadUsers();
      loadStats();
    } catch (error) {
      if (window.AdminToast) {
        window.AdminToast.error(error.message || t("failed_save_user"));
      }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.originalText || t("save"); }
    }
  }

  /* ============================================================
   * VIEW USER
   * ============================================================ */
  function viewUser(user) {
    closeAllModals();
    document.getElementById("detailAvatar").textContent = avatarInitial(user.name || "U");
    document.getElementById("detailName").textContent = user.name || "\u2014";
    document.getElementById("detailRoleWrap").innerHTML = rolePill(user.role);
    document.getElementById("detailId").textContent = user.id;
    document.getElementById("detailEmail").textContent = user.email || "\u2014";
    document.getElementById("detailPhone").textContent = user.phone || "\u2014";
    document.getElementById("detailBalance").textContent = money(user.balance) + " ETB";
    document.getElementById("detailStatus").textContent = statusLabel(user.status);
    document.getElementById("detailJoined").textContent = formatDate(user.createdAt) + " | " + formatDateTime(user.createdAt);
    openModal("viewUserModal");
  }

  /* ============================================================
   * ASSIGN ROLE
   * ============================================================ */
  function openAssignRoleModal(user) {
    closeAllModals();
    document.getElementById("assignRoleName").textContent = (user.name || "User") + " (" + (user.email || "") + ")";
    document.getElementById("assignRoleSelect").value = user.role === "customer" ? "kitchen" : (user.role || "kitchen");
    document.getElementById("assignRoleSelect").dataset.userId = user.id;
    openModal("assignRoleModal");
  }

  async function confirmAssignRole() {
    var select = document.getElementById("assignRoleSelect");
    var id = select.dataset.userId;
    var role = select.value;
    if (!id || !role) return;

    try {
      await window.AdminAPI.patch("/admin/users/" + id + "/role", { role: role });
      closeModal("assignRoleModal");
      if (window.AdminToast) window.AdminToast.success(t("role_updated"));
      loadUsers();
      loadStats();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || t("failed_role"));
    }
  }

  /* ============================================================
   * STATUS TOGGLE (ACTIVE / BLOCKED / SUSPENDED)
   * ============================================================ */
  function openStatusModal(user) {
    closeAllModals();
    var currentStatus = String(user.status || "ACTIVE").toUpperCase();
    document.getElementById("statusUserName").textContent = (user.name || "User") + " (" + (user.email || "") + ")";
    document.getElementById("statusSelect").value = currentStatus;
    document.getElementById("statusSelect").dataset.userId = user.id;
    document.getElementById("statusSelect").dataset.currentStatus = currentStatus;
    openModal("statusModal");
  }

  async function confirmStatusChange() {
    var select = document.getElementById("statusSelect");
    var id = select.dataset.userId;
    var newStatus = select.value;
    if (!id || !newStatus) return;

    try {
      await window.AdminAPI.patch("/admin/users/" + id + "/status", { status: newStatus });
      closeModal("statusModal");
      if (window.AdminToast) window.AdminToast.success(t("status_updated"));
      loadUsers();
      loadStats();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || t("failed_status"));
    }
  }

  /* ============================================================
   * RESET PASSWORD
   * ============================================================ */
  function openPasswordResetModal(user) {
    closeAllModals();
    document.getElementById("resetPwdUserName").textContent = (user.name || "User") + " (" + (user.email || "") + ")";
    document.getElementById("resetPwdNewPassword").value = "";
    document.getElementById("resetPwdConfirmPassword").value = "";
    document.getElementById("resetPwdUserId").value = user.id;
    openModal("resetPasswordModal");
  }

  async function confirmPasswordReset() {
    var id = document.getElementById("resetPwdUserId").value;
    var newPwd = document.getElementById("resetPwdNewPassword").value;
    var confirmPwd = document.getElementById("resetPwdConfirmPassword").value;
    if (!id) return;

    if (!newPwd || newPwd.length < 6) {
      if (window.AdminToast) window.AdminToast.error(t("password_min_6"));
      return;
    }
    if (newPwd !== confirmPwd) {
      if (window.AdminToast) window.AdminToast.error(t("passwords_no_match"));
      return;
    }

    try {
      await window.AdminAPI.patch("/admin/users/" + id + "/password", { password: newPwd });
      closeModal("resetPasswordModal");
      if (window.AdminToast) window.AdminToast.success(t("password_reset_success"));
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || t("failed_password_reset"));
    }
  }

  /* ============================================================
   * DELETE (SOFT DELETE = DEACTIVATE)
   * ============================================================ */
  async function deleteUser(user) {
    var msg = t("confirm_delete_user").replace("{name}", user.name);
    if (!window.confirm(msg)) return;

    try {
      await window.AdminAPI.del("/admin/users/" + user.id);
      if (window.AdminToast) window.AdminToast.success(t("user_deactivated"));
      if (state.total === 1 && state.page > 1) state.page--;
      loadUsers();
      loadStats();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || t("failed_delete"));
    }
  }

  async function findUserById(id) {
    try {
      var data = await window.AdminAPI.get("/admin/users/" + id);
      return data.user || null;
    } catch (e) {
      return null;
    }
  }

  /* ============================================================
   * EVENT BINDINGS
   * ============================================================ */
  function bindEvents() {
    // Open add-user modal
    var addBtn = document.getElementById("openAddUserModalBtn");
    if (addBtn) addBtn.addEventListener("click", openAddUserModal);

    // Form submit
    var userForm = document.getElementById("userForm");
    if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);

    // Close buttons
    document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeModal(btn.getAttribute("data-close-modal"));
      });
    });

    // Modal overlay click (close on backdrop)
    document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) overlay.classList.remove("open");
      });
    });

    // Search (debounced)
    var searchInput = document.getElementById("userSearchInput");
    if (searchInput) {
      var debounceTimer = null;
      searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          state.search = searchInput.value.trim();
          state.page = 1;
          loadUsers();
        }, 400);
      });
    }

    // Role filter
    var roleSelect = document.getElementById("roleFilter");
    if (roleSelect) {
      roleSelect.addEventListener("change", function () {
        state.role = roleSelect.value;
        state.page = 1;
        loadUsers();
      });
    }

    // Status filter
    var statusSelect = document.getElementById("statusFilter");
    if (statusSelect) {
      statusSelect.addEventListener("change", function () {
        state.status = statusSelect.value;
        state.page = 1;
        loadUsers();
      });
    }

    // Reset filters
    var resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (roleSelect) roleSelect.value = "";
        if (statusSelect) statusSelect.value = "";
        state.search = "";
        state.role = "";
        state.status = "";
        state.page = 1;
        loadUsers();
      });
    }

    // Pagination
    var prevBtn = document.getElementById("prevPageBtn");
    var nextBtn = document.getElementById("nextPageBtn");
    if (prevBtn) prevBtn.addEventListener("click", function () { changePage(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { changePage(1); });

    // Table row actions (event delegation)
    var tbody = document.getElementById("usersTableBody");
    if (tbody) {
      tbody.addEventListener("click", async function (e) {
        var btn = e.target.closest("[data-action]");
        if (!btn) return;
        var id = btn.getAttribute("data-id");
        var action = btn.getAttribute("data-action");
        if (!id) return;

        var user = (window.__usersCache || []).find(function (u) { return u.id === id; });
        if (!user) user = await findUserById(id);
        if (!user) {
          if (window.AdminToast) window.AdminToast.error(t("user_not_found"));
          return;
        }

        if (action === "view") viewUser(user);
        else if (action === "edit") openEditUserModal(user);
        else if (action === "role") openAssignRoleModal(user);
        else if (action === "password") openPasswordResetModal(user);
        else if (action === "toggle") openStatusModal(user);
        else if (action === "delete") deleteUser(user);
      });
    }

    // Assign role modal save
    var confirmRoleBtn = document.getElementById("confirmAssignRoleBtn");
    if (confirmRoleBtn) confirmRoleBtn.addEventListener("click", confirmAssignRole);

    // Status change modal save
    var confirmStatusBtn = document.getElementById("confirmStatusBtn");
    if (confirmStatusBtn) confirmStatusBtn.addEventListener("click", confirmStatusChange);

    // Password reset modal save
    var confirmPwdBtn = document.getElementById("confirmResetPwdBtn");
    if (confirmPwdBtn) confirmPwdBtn.addEventListener("click", confirmPasswordReset);
  }

  /* ============================================================
   * i18n RE-RENDER ON LANGUAGE CHANGE
   * ============================================================ */
  function onLanguageChange() {
    renderUsers(window.__usersCache || []);
    renderPagination();
    updatePageTexts();
  }

  function updatePageTexts() {
    var h1 = document.querySelector(".page-header h1");
    if (h1) h1.textContent = t("admin_users_title");
    var sub = document.querySelector(".page-header .subtitle");
    if (sub) sub.textContent = t("admin_users_subtitle");
    var addBtn = document.getElementById("openAddUserModalBtn");
    if (addBtn) addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> ' + t("add_user");
    var searchInput = document.getElementById("userSearchInput");
    if (searchInput) searchInput.placeholder = t("admin_user_search");

    // Stats labels
    var lbl1 = document.querySelector('[data-label-key="total_users"]');
    var lbl2 = document.querySelector('[data-label-key="active_customers"]');
    var lbl3 = document.querySelector('[data-label-key="staff"]');
    var lbl4 = document.querySelector('[data-label-key="blocked_users"]');
    if (lbl1) lbl1.textContent = t("total_users");
    if (lbl2) lbl2.textContent = t("active_customers");
    if (lbl3) lbl3.textContent = t("staff");
    if (lbl4) lbl4.textContent = t("blocked_users");

    // Table headers
    var ths = document.querySelectorAll("#usersTableBody").length ? document.querySelectorAll(".admin-table thead th") : [];
    // Column labels are in HTML, updated by applyTranslations via data-i18n

    // Modal titles
    var modalTitle = document.getElementById("modalTitle");
    if (modalTitle && !document.getElementById("userId").value) modalTitle.textContent = t("add_user");
    else if (modalTitle) modalTitle.textContent = t("edit_user");
  }

  function init() {
    bindEvents();
    loadStats();
    loadUsers();
    updatePageTexts();

    // Listen for language changes
    window.addEventListener("language:changed", onLanguageChange);
    window.addEventListener("languageChanged", onLanguageChange);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
