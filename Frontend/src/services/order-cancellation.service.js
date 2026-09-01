/**
 * Order Cancellation Service
 * File: frontend/src/services/order-cancellation.service.js
 */

import api from "../js/api.js";

class OrderCancellationService {

    /**
     * Customer: submit a cancellation request for an order.
     * POST /api/v1/cancellations/request
     */
    async requestCancellation(orderId, reason = "OTHER", details = "") {
        if (!orderId) throw new Error("Order ID is required.");
        if (!reason) throw new Error("Cancellation reason is required.");
        return api.post(
            "/cancellations/request",
            { orderId, reason, details }
        );
    }

    /**
     * Customer: check whether an order can be cancelled.
     * GET /api/v1/cancellations/:orderId/check
     */
    async checkCancellation(orderId) {
        if (!orderId) throw new Error("Order ID is required.");
        return api.get(
            `/cancellations/${encodeURIComponent(orderId)}/check`
        );
    }

    /**
     * Customer: legacy direct cancel (no longer allowed — requests go to admin).
     */
    async cancelOrder(orderId, reason = "") {
        return this.requestCancellation(orderId, reason || "OTHER", "Cancelled by customer");
    }

    /**
     * Admin: get a cancellation by id, number, or orderId.
     * GET /api/v1/cancellations/:id
     */
    async getCancellation(id) {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.get(`/cancellations/${encodeURIComponent(id)}`);
    }

    /**
     * Admin: list cancellations.
     * GET /api/v1/cancellations?search=&status=&paymentStatus=&refundStatus=&sort=&page=&limit=
     */
    async getAll(query = {}) {
        const params = typeof query === "object" && query ? new URLSearchParams(query).toString() : "";
        return api.get(`/cancellations${params ? "?" + params : ""}`);
    }

    /**
     * Admin: approve a cancellation request.
     * PATCH /api/v1/cancellations/:id/approve
     */
    async approveCancellation(id, adminNote = "") {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.patch(
            `/cancellations/${encodeURIComponent(id)}/approve`,
            { adminNote }
        );
    }

    /**
     * Admin: reject a cancellation request.
     * PATCH /api/v1/cancellations/:id/reject
     */
    async rejectCancellation(id, adminNote = "") {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.patch(
            `/cancellations/${encodeURIComponent(id)}/reject`,
            { adminNote: adminNote || "Cancellation request rejected" }
        );
    }

    /**
     * Admin: request a refund.
     * POST /api/v1/cancellations/:id/refund/request
     */
    async requestRefund(id) {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.post(`/cancellations/${encodeURIComponent(id)}/refund/request`, {});
    }

    /**
     * Admin/provider: confirm a refund (provider confirmation).
     * POST /api/v1/cancellations/:id/refund/confirm
     */
    async confirmRefund(id, providerReference = "") {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.post(`/cancellations/${encodeURIComponent(id)}/refund/confirm`, {
            providerReference: providerReference || `SIM-${Date.now()}`
        });
    }

    /**
     * Admin: mark a refund as failed.
     * POST /api/v1/cancellations/:id/refund/fail
     */
    async failRefund(id, error = "") {
        if (!id) throw new Error("Cancellation ID is required.");
        return api.post(`/cancellations/${encodeURIComponent(id)}/refund/fail`, { error });
    }
}

const orderCancellationService = new OrderCancellationService();

export default orderCancellationService;