/**
 * ==========================================================================
 * SMART CAFETERIA ORDERING SYSTEM - ADMIN CANCELLATIONS
 * ==========================================================================
 * Admin cancellation request management driven by the backend API:
 *   GET    /cancellations/stats            (stats)
 *   GET    /cancellations?status=&search=  (list)
 *   PATCH  /cancellations/:orderId/approve (approve)
 *   PATCH  /cancellations/:orderId/reject  (reject)
 *
 * Requires window.AdminAPI (admin-api.js) loaded first.
 * ============================================================================
 */
(function () {
  "use strict";

  var state = {
    page: 1,
    limit: 10,
    status: "all",
    search: ""
  };

  function money(value) {
    if (value === null || value === undefined) return "0.00";
    return Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function openModal(id) { var el = document.getElementById(id); if (el) el.classList.add("open"); }
  function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove("open"); }
  function closeAllModals() { document.querySelectorAll(".modal-overlay.open").forEach(function(m) { m.classList.remove("open"); }); }

  document.addEventListener("click", function(e) {
    var closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) closeModal(closeBtn.getAttribute("data-close-modal"));
    var overlay = e.target.closest(".modal-overlay");
    if (overlay && e.target === overlay) closeAllModals();
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeAllModals();
  });

  function statusBadge(status) {
    var s = String(status || "pending").toLowerCase();
    var cls = "order-badge";
    var label = s.charAt(0).toUpperCase() + s.slice(1);
    if (s === "pending") cls += " pend";
    else if (s === "approved") cls += " cmp";
    else if (s === "rejected") cls += " cxl";
    return '<span class="' + cls + '">' + label + '</span>';
  }

  async function loadStats() {
    if (!window.AdminAPI) return;
    try {
      var data = await window.AdminAPI.get("/cancellations/stats");
      var s = data.stats || {};
      var totalEl = document.getElementById("statTotalCancellations");
      var pendingEl = document.getElementById("statPendingCancellations");
      var refundedEl = document.getElementById("statRefundedToday");
      var refundAmountEl = document.getElementById("statTotalRefunds");

      var total = s.totalCancellations || 0;
      var pending = s.pendingApproval || 0;
      var refundedToday = s.refundedToday || 0;
      var totalRefunds = s.totalRefundAmount || 0;

      if (totalEl) totalEl.textContent = total;
      if (pendingEl) pendingEl.textContent = pending;
      if (refundedEl) refundedEl.textContent = refundedToday;
      if (refundAmountEl) refundAmountEl.innerHTML = money(totalRefunds) + " <small>ETB</small>";

      var sidebarBadge = document.getElementById("sidebarRefundBadge");
      if (sidebarBadge) {
        sidebarBadge.textContent = pending;
        sidebarBadge.style.display = pending > 0 ? "inline-block" : "none";
      }
    } catch (e) {
      /* stats are non-critical */
    }
  }

  async function loadCancellations() {
    var tbody = document.getElementById("cancellationsTableBody");
    if (!tbody || !window.AdminAPI) return;

    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Loading cancellations...</td></tr>';

    try {
      var data = await window.AdminAPI.get("/cancellations", {
        page: state.page,
        limit: state.limit,
        status: state.status
      });

      var items = data.cancellations || [];

      if (state.search) {
        var term = state.search.toLowerCase();
        items = items.filter(function(c) {
          return String(c.orderId || "").toLowerCase().indexOf(term) !== -1 ||
                 String(c.customerName || "").toLowerCase().indexOf(term) !== -1 ||
                 String(c.reason || "").toLowerCase().indexOf(term) !== -1;
        });
      }

      state.total = data.total || items.length;
      state.pages = Math.max(Math.ceil(state.total / state.limit), 1);
      window.__cancellationsCache = items;
      renderCancellations(items);
      renderPagination();
    } catch (error) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Failed to load cancellations: ' + window.esc(error.message || "Server error") + '</td></tr>';
    }
  }

  function renderCancellations(items) {
    var tbody = document.getElementById("cancellationsTableBody");
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No cancellation requests found.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map(function(c) {
      var customer = c.customerName || (c.user && c.user.name) || "—";
      return (
        "<tr>" +
        '<td><strong>' + window.esc(c.orderId || "—") + '</strong></td>' +
        '<td>' + window.esc(customer) + '<br><small class="table-muted">' + window.esc(c.customerPhone || (c.user && c.user.phone) || "") + '</small></td>' +
        '<td>' + window.esc(c.reason || "—") + '</td>' +
        '<td>' + money(c.totalAmount) + ' ETB</td>' +
        '<td>' + statusBadge(c.status) + '</td>' +
        '<td>' + window.AdminAPI.formatDateTime(c.requestedAt) + '</td>' +
        '<td>' +
        '<div class="table-actions">' +
          '<button class="action-btn" data-action="view" data-id="' + window.esc(c.orderId || c.id) + '" title="View details"><i class="fa-solid fa-eye"></i></button>' +
          '<button class="action-btn" data-action="approve" data-id="' + window.esc(c.orderId || c.id) + '" title="Approve"><i class="fa-solid fa-check"></i></button>' +
          '<button class="action-btn danger" data-action="reject" data-id="' + window.esc(c.orderId || c.id) + '" title="Reject"><i class="fa-solid fa-times"></i></button>' +
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

    if (info) info.textContent = "Page " + state.page + " of " + Math.max(state.pages, 1) + " (" + state.total + " cancellations)";
    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= state.pages;
  }

  function changePage(delta) {
    state.page += delta;
    if (state.page < 1) state.page = 1;
    loadCancellations();
  }

  function viewCancellation(c) {
    closeAllModals();

    setText("modalCancellationOrderId", c.orderId || "—");
    setText("modalCancCustomer", c.customerName || (c.user && c.user.name) || "—");
    setText("modalCancPhone", c.customerPhone || (c.user && c.user.phone) || "—");
    setText("modalCancEmail", (c.user && c.user.email) || "—");
    setText("modalCancOrderType", c.orderType || "—");
    setText("modalCancTableNumber", c.tableNumber || "—");
    setText("modalCancOrderStatus", c.orderStatus || "—");
    setText("modalCancPaymentStatus", c.paymentStatus || "—");
    setText("modalCancAmount", money(c.totalAmount) + " ETB");
    setText("modalCancReason", c.reason || "—");
    setText("modalCancRequestedAt", window.AdminAPI.formatDateTime(c.requestedAt));
    var statusEl = document.getElementById("modalCancStatus");
    if (statusEl) statusEl.innerHTML = statusBadge(c.status);

    var itemsBody = document.getElementById("modalCancItemsBody");
    if (itemsBody) {
      var items = c.items || [];
      if (!items.length) {
        itemsBody.innerHTML = '<tr><td colspan="4" class="table-empty">No items</td></tr>';
      } else {
        itemsBody.innerHTML = items.map(function(i) {
          var subtotal = (Number(i.price) || 0) * (Number(i.quantity) || 0);
          return '<tr>' +
            '<td>' + window.esc(i.name || "—") + '</td>' +
            '<td>' + money(i.price) + ' ETB</td>' +
            '<td>' + (i.quantity || 0) + '</td>' +
            '<td>' + money(subtotal) + ' ETB</td>' +
            '</tr>';
        }).join("");
      }
    }

    var subtotal = Number(c.totalAmount) || 0;
    var serviceFee = 0;
    var total = subtotal + serviceFee;
    setText("modalCancSubtotal", money(subtotal) + " ETB");
    setText("modalCancServiceFee", money(serviceFee) + " ETB");
    setText("modalCancTotal", money(total) + " ETB");

    var noteEl = document.getElementById("cancAdminNote");
    if (noteEl) noteEl.value = (c.details && c.details !== c.reason) ? c.details : "";
    var approveBtn = document.getElementById("approveCancellationBtn");
    var rejectBtn = document.getElementById("rejectCancellationBtn");
    if (approveBtn) approveBtn.dataset.orderId = c.orderId || "";
    if (rejectBtn) rejectBtn.dataset.orderId = c.orderId || "";

    openModal("cancellationDetailsModal");
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function findCancellation(orderId) {
    return (window.__cancellationsCache || []).find(function(c) { return c.orderId === orderId; });
  }

  async function processCancellation(orderId, action) {
    if (!orderId) return;
    var noteEl = document.getElementById("cancAdminNote");
    var adminNote = noteEl ? noteEl.value.trim() : "";
    if (action === "reject" && !adminNote) {
      adminNote = "Cancellation request rejected";
    }

    if (action === "approve") {
      if (!window.confirm('Approve cancellation for order #' + orderId + '? The customer will be refunded.')) return;
    } else {
      if (!window.confirm('Reject cancellation for order #' + orderId + '?')) return;
    }

    try {
      var endpoint = "/cancellations/" + encodeURIComponent(orderId) + "/" + action;
      await window.AdminAPI.patch(endpoint, { adminNote: adminNote });
      if (window.AdminToast) {
        window.AdminToast.success(action === "approve" ? "Cancellation approved and refund processed" : "Cancellation rejected");
      }
      closeModal("cancellationDetailsModal");
      loadStats();
      loadCancellations();
    } catch (error) {
      if (window.AdminToast) window.AdminToast.error(error.message || "Failed to process cancellation");
    }
  }

  function bindEvents() {
    var searchInput = document.getElementById("cancellationSearchInput");
    if (searchInput) {
      var debounceTimer = null;
      searchInput.addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          state.search = searchInput.value.trim();
          state.page = 1;
          loadCancellations();
        }, 400);
      });
    }

    var statusFilter = document.getElementById("cancellationStatusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", function() {
        state.status = statusFilter.value;
        state.page = 1;
        loadCancellations();
      });
    }

    var resetBtn = document.getElementById("resetCancellationFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function() {
        if (searchInput) searchInput.value = "";
        if (statusFilter) statusFilter.value = "all";
        state.search = "";
        state.status = "all";
        state.page = 1;
        loadCancellations();
      });
    }

    var prevBtn = document.getElementById("prevPageBtn");
    if (prevBtn) prevBtn.addEventListener("click", function() { if (state.page > 1) changePage(-1); });
    var nextBtn = document.getElementById("nextPageBtn");
    if (nextBtn) nextBtn.addEventListener("click", function() { changePage(1); });

    var approveBtn = document.getElementById("approveCancellationBtn");
    if (approveBtn) approveBtn.addEventListener("click", function() { processCancellation(approveBtn.dataset.orderId, "approve"); });
    var rejectBtn = document.getElementById("rejectCancellationBtn");
    if (rejectBtn) rejectBtn.addEventListener("click", function() { processCancellation(rejectBtn.dataset.orderId, "reject"); });

    var tbody = document.getElementById("cancellationsTableBody");
    if (tbody) {
      tbody.addEventListener("click", function(e) {
        var btn = e.target.closest("[data-action]");
        if (!btn) return;
        var id = btn.getAttribute("data-id");
        var action = btn.getAttribute("data-action");
        if (!id) return;

        var c = findCancellation(id);
        if (!c) {
          if (window.AdminToast) window.AdminToast.error("Cancellation not found");
          return;
        }

        if (action === "view") viewCancellation(c);
        else if (action === "approve") processCancellation(c.orderId, "approve");
        else if (action === "reject") processCancellation(c.orderId, "reject");
      });
    }
  }

  function init() {
    bindEvents();
    loadStats();
    loadCancellations();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
