const mongoose = require("mongoose");

/**
 * Payment Schema - Track payments
 *
 * Frontend Usage:
 * - checkout.js: Chapa checkout
 * - admin/payments.html: View all payments
 */
const PaymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    provider: {
      type: String,
      enum: ["TELEBIRR", "CHAPA", "CBE_BIRR", "CASH", "BANK_TRANSFER"],
      required: true,
    },
    method: {
      type: String,
      enum: ["TELEBIRR", "CHAPA", "CBE_BIRR", "CASH", "BANK_TRANSFER", "WALLET", "CARD"],
      required: true,
    },
    currency: {
      type: String,
      default: "ETB",
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      default: "",
    },
    reference: {
      type: String,
      default: "",
    },
    chapaReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    checkoutUrl: {
      type: String,
      default: "",
    },
    providerReference: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    refundStatus: {
      type: String,
      enum: ["NONE", "PENDING", "REFUNDED", "FAILED"],
      default: "NONE",
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundReference: {
      type: String,
      default: null,
    },
    providerEventId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Generate transaction ID and payment number before saving
PaymentSchema.pre("save", function () {
  if (!this.transactionId) {
    const prefix = this.provider.toUpperCase();
    this.transactionId = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
  if (!this.paymentNumber) {
    this.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
});

PaymentSchema.index({ status: 1 });
PaymentSchema.index({ method: 1 });
PaymentSchema.index({ reference: 1 });
PaymentSchema.index({ providerReference: 1 });
PaymentSchema.index({ paymentDate: -1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ providerEventId: 1 });
PaymentSchema.index({ paymentNumber: 1 });

module.exports = mongoose.model("Payment", PaymentSchema);
