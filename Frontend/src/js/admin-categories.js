/**
 * ==========================================================================
 * SMART CAFETERIA ORDERING SYSTEM - ADMIN CATEGORIES
 * ==========================================================================
 * Admin Category Management driven by the backend API:
 *   GET    /admin/categories        (list)
 *   GET    /admin/categories/:id    (details)
 *   POST   /admin/categories        (create)
 *   PUT    /admin/categories/:id    (update)
 *   PATCH  /admin/categories/:id/status (toggle active)
 *   DELETE /admin/categories/:id    (delete)
 *
 * Requires window.AdminAPI (admin-api.js) loaded first.
 * ============================================================================
 */
(function () {
  "use strict";

  var state = {
    page: 1,
    limit: 10,
    search: "",
    status: ""
  };

  function escapeHtml(value) {
    return window.esc(value);
  }

  function openModal(id) { var el = document.getElementById(id); if (el) el.classList.add("open"); }
  function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove("open"); }
  function closeAllModals() { document.querySelectorAll(".modal-overlay.open").forEach(function(m) { m.classList.remove("open"); }); }

  function categoryName(cat) {
    if (!cat) return "";
    var n = cat.name;
    if (n && typeof n === "object") return n.en || n.am || "";
    return String(n || "");
  }

  function categoryDescription(cat) {
    if (!cat) return "";
    var d = cat.description;
    if (d && typeof d === "object") return d.en || d.am || "";
    return String(d || "");
  }

  document.addEventListener("click", function(e) {
    var closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) closeModal(closeBtn.getAttribute("data-close-modal"));
    var overlay = e.target.closest(".modal-overlay");
    if (overlay && e.target === overlay) closeAllModals();
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeAllModals();
  });

  async function loadCategories() {
    var tbody = document.getElementById("categoriesTableBody");
    if (!tbody || !window.AdminAPI) return;

    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Loading categories...</td></tr>';

    try {
      var data = await window.AdminAPI.get("/admin/categories", {
        page: state.page,
        limit: state.limit,
        search: state.search,
        status: state.status
      });

      state.total = data.total || 0;
      state.pages = data.pages || Math.max(Math.ceil(state.total / state.limit), 1);
      window.__categoriesCache = data.categories || [];
      renderCategories(window.__categoriesCache);
      renderPagination();
    } catch (error) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Failed to load categories: ' + window.esc(error.message || "Server error") + '</td></tr>';
    }
  }

  function renderCategories(categories) {
    var tbody = document.getElementById("categoriesTableBody");
    if (!tbody) return;

    if (!categories.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No categories found.</td></tr>';
      return;
    }

    tbody.innerHTML = categories.map(function (cat) {
      var isActive = cat.isActive !== false;
      var icon = cat.icon || "fa-solid fa-tag";
      return (
        "<tr>" +
        '<td><strong>' + window.esc(categoryName(cat)) + '</strong><br><small class="table-muted">' + window.esc(icon) + '</small></td>' +
        '<td><span class="category-pill">' + window.esc(cat.category || "-") + '</span></td>' +
        '<td>' + (isActive ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Inactive</span>') + '</td>' +
        '<td>' + window.esc(categoryDescription(cat) || "-") + '</td>' +
        '<td>' + window.AdminAPI.formatDate(cat.createdAt) + '</td>' +
        '<td>' +
        '<div class="table-actions">' +
          '<button class="action-btn" data-action="edit" data-id="' + window.esc(cat.id) + '" title="Edit category"><i class="fa-solid fa-pen"></i></button>' +
          '<button class="action-btn" data-action="toggle" data-id="' + window.esc(cat.id) + '" title="' + (isActive ? "Deactivate" : "Activate") + '"><i class="fa-solid ' + (isActive ? "fa-toggle-on" : "fa-toggle-off") + '"></i></button>' +
          '<button class="action-btn danger" data-action="delete" data-id="' + window.esc(cat.id) + '" title="Delete category"><i class="fa-solid fa-trash"></i></button>' +
        '</div>' +
        '</td>' +
        '</tr>'
      );
    }).join("");
  }

  function renderPagination() {
    var info = document.getElementById("paginationInfo");
    var prevBtn = document.getElementById("prevPageBtn");
    var nextBtn = document.getElementById("nextPageBtn");

    if (info) info.textContent = "Page " + state.page + " of " + Math.max(state.pages, 1) + " (" + state.total + " categories)";
    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= state.pages;
  }

  function changePage(delta) {
    state.page += delta;
    if (state.page < 1) state.page = 1;
    loadCategories();
  }

  function openAddCategoryModal() {
    closeAllModals();
    var form = document.getElementById("categoryForm");
    if (form) form.reset();
    var idEl = document.getElementById("categoryId");
    if (idEl) idEl.value = "";
    var titleEl = document.getElementById("categoryModalTitle");
    if (titleEl) titleEl.textContent = "Add New Category";
    var saveBtn = document.getElementById("saveCategoryBtn");
    if (saveBtn) saveBtn.textContent = "Save Category";
    var activeEl = document.getElementById("categoryIsActive");
    if (activeEl) activeEl.checked = true;
    openModal("categoryModal");
  }

  function openEditCategoryModal(category) {
    if (!category) return;
    closeAllModals();
    var form = document.getElementById("categoryForm");
    if (form) form.reset();
    var idEl = document.getElementById("categoryId");
    if (idEl) idEl.value = category.id || "";
    var nameEl = document.getElementById("categoryName");
    if (nameEl) nameEl.value = categoryName(category);
    var iconEl = document.getElementById("categoryIcon");
    if (iconEl) iconEl.value = category.icon || "fa-solid fa-tag";
    var descEl = document.getElementById("categoryDescription");
    if (descEl) descEl.value = categoryDescription(category);
    var activeEl = document.getElementById("categoryIsActive");
    if (activeEl) activeEl.checked = category.isActive !== false;
    var titleEl = document.getElementById("categoryModalTitle");
    if (titleEl) titleEl.textContent = "Edit Category";
    var saveBtn = document.getElementById("saveCategoryBtn");
    if (saveBtn) saveBtn.textContent = "Update Category";
    openModal("categoryModal");
  }

  async function handleCategoryFormSubmit(event) {
    event.preventDefault();

    var idEl = document.getElementById("categoryId");
    var id = idEl ? idEl.value : "";
    var payload = {
      name: (document.getElementById("categoryName") || {}).value || "",
      icon: ((document.getElementById("categoryIcon") || {}).value || "fa-solid fa-tag").trim(),
      description: (document.getElementById("categoryDescription") || {}).value || "",
      isActive: !!(document.getElementById("categoryIsActive") || {}).checked
    };

    if (!payload.name.trim()) {
      if (window.AdminToast) window.AdminToast.error("Category name is required");
      return;
    }

    try {
      if (!id) {
        await window.AdminAPI.post("/admin/categories", payload);
      } else {
        await window.AdminAPI.put("/admin/categories/" + encodeURIComponent(id), payload);
      }
      closeModal("categoryModal");
      if (window.AdminToast) window.AdminToast.success("Category saved successfully");
      loadCategories();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || "Failed to save category");
    }
  }

  async function toggleCategoryStatus(category) {
    if (!category) return;
    var nextStatus = category.isActive !== false ? false : true;
    var message = (category.isActive !== false ? "Deactivate" : "Activate") + ' category "' + categoryName(category) + '"?';

    if (!window.confirm(message)) return;

    try {
      await window.AdminAPI.patch("/admin/categories/" + encodeURIComponent(category.id) + "/status", { isActive: nextStatus });
      if (window.AdminToast) window.AdminToast.success(nextStatus ? "Category activated" : "Category deactivated");
      loadCategories();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || "Failed to update category status");
    }
  }

  async function deleteCategory(category) {
    if (!category) return;
    if (!window.confirm('Delete category "' + categoryName(category) + '"? This action cannot be undone.')) return;

    try {
      await window.AdminAPI.del("/admin/categories/" + encodeURIComponent(category.id));
      if (window.AdminToast) window.AdminToast.success("Category deleted successfully");
      if (state.total === 1 && state.page > 1) state.page--;
      loadCategories();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || "Failed to delete category");
    }
  }

  function findCategoryById(id) {
    return window.AdminAPI.get("/admin/categories/" + encodeURIComponent(id)).then(function(d) { return d.category; }).catch(function() { return null; });
  }

  function bindEvents() {
    var openBtn = document.getElementById("openAddCategoryBtn");
    if (openBtn) openBtn.addEventListener("click", openAddCategoryModal);

    var form = document.getElementById("categoryForm");
    if (form) form.addEventListener("submit", handleCategoryFormSubmit);

    var searchInput = document.getElementById("categorySearchInput");
    if (searchInput) {
      var debounceTimer = null;
      searchInput.addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          state.search = searchInput.value.trim();
          state.page = 1;
          loadCategories();
        }, 400);
      });
    }

    var statusFilter = document.getElementById("statusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", function() {
        state.status = statusFilter.value;
        state.page = 1;
        loadCategories();
      });
    }

    var resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function() {
        if (searchInput) searchInput.value = "";
        if (statusFilter) statusFilter.value = "";
        state.search = "";
        state.status = "";
        state.page = 1;
        loadCategories();
      });
    }

    var prevBtn = document.getElementById("prevPageBtn");
    if (prevBtn) prevBtn.addEventListener("click", function() { if (state.page > 1) changePage(-1); });
    var nextBtn = document.getElementById("nextPageBtn");
    if (nextBtn) nextBtn.addEventListener("click", function() { changePage(1); });

    var tbody = document.getElementById("categoriesTableBody");
    if (tbody) {
      tbody.addEventListener("click", async function(e) {
        var btn = e.target.closest("[data-action]");
        if (!btn) return;
        var id = btn.getAttribute("data-id");
        var action = btn.getAttribute("data-action");
        if (!id) return;

        var category = (window.__categoriesCache || []).find(function(c) { return c.id === id; });
        if (!category && (action === "edit" || action === "toggle" || action === "delete")) {
          category = await findCategoryById(id);
        }
        if (!category) {
          if (window.AdminToast) window.AdminToast.error("Category not found");
          return;
        }

        if (action === "edit") openEditCategoryModal(category);
        else if (action === "toggle") toggleCategoryStatus(category);
        else if (action === "delete") deleteCategory(category);
      });
    }
  }

  function init() {
    bindEvents();
    loadCategories();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
