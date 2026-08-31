const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const telebirr = require('../services/telebirr.service');
const { PAYMENT_METHODS, PAYMENT_STATUS } = require('../config/constants');

function buildSimulationUrl(orderId, paymentId, method, txRef) {
    const base = process.env.FRONTEND_URL || 'http://localhost:5500';
    return `${base}/public/simulation-payment.html?orderId=${encodeURIComponent(orderId)}&paymentId=${paymentId}&method=${method}&txRef=${txRef}`;
}

exports.initializeTelebirrPayment = async (req, res) => {
    try {
        const { orderId, returnUrl } = req.body;
        const order = await Order.findOne({ orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
            return res.status(400).json({ success: false, message: 'Order has already been paid.' });
        }
        const pendingPayment = await Payment.findOne({
            orderId: order._id,
            provider: PAYMENT_METHODS.TELEBIRR,
            status: PAYMENT_STATUS.PENDING,
            checkoutUrl: { $ne: '' }
        });
        if (pendingPayment) {
            return res.status(200).json({ success: true, message: 'Payment already initialized', data: { paymentId: pendingPayment._id, checkoutUrl: pendingPayment.checkoutUrl } });
        }
        const user = await User.findById(req.user.id).select('name email phone');
        const providerReference = `CAF-${order.orderId}-${Date.now()}`;
        const payment = await Payment.create({
            orderId: order._id,
            userId: req.user.id,
            provider: PAYMENT_METHODS.TELEBIRR,
            method: PAYMENT_METHODS.TELEBIRR,
            amount: order.totalAmount,
            currency: 'ETB',
            status: PAYMENT_STATUS.PENDING,
            providerReference,
            metadata: { name: user.name, email: user.email, phone: user.phone }
        });

        let checkoutUrl = '';

        try {
            const [firstName, ...lastNameParts] = (user.name || 'Customer').trim().split(/\s+/);
            const providerResponse = await telebirr.initializePayment({
                amount: String(order.totalAmount),
                currency: 'ETB',
                email: user.email,
                first_name: firstName,
                last_name: lastNameParts.join(' ') || firstName,
                phone_number: user.phone,
                tx_ref: providerReference,
                callback_url: process.env.CHAPA_CALLBACK_URL,
                return_url: returnUrl || process.env.CHAPA_RETURN_URL,
                customization: { title: 'Smart Cafeteria', description: `Order ${order.orderId}` }
            });
            checkoutUrl = providerResponse.data?.checkout_url || providerResponse.checkoutUrl || '';
        } catch (providerError) {
            console.log('Telebirr real API failed, falling back to simulation:', providerError.message);
        }

        console.log('[TELEBIRR] checkoutUrl after API attempt:', JSON.stringify(checkoutUrl));
        if (!checkoutUrl) {
            checkoutUrl = buildSimulationUrl(orderId, payment._id, PAYMENT_METHODS.TELEBIRR, providerReference);
            console.log('[TELEBIRR] built simulation URL:', checkoutUrl);
        }

        payment.checkoutUrl = checkoutUrl;
        await payment.save();
        console.log('[TELEBIRR] final checkoutUrl:', checkoutUrl);
        return res.status(201).json({ success: true, message: 'Payment initialized successfully', data: { paymentId: payment._id, checkoutUrl } });
    } catch (error) {
        return res.status(error.statusCode || 502).json({ success: false, message: error.message });
    }
};

exports.telebirrCallback = async (req, res) => {
    const providerReference = req.body?.providerReference || req.body?.transactionId || req.query.providerReference;
    if (!providerReference) return res.status(400).json({ success: false, message: 'Provider reference is required' });
    const payment = await Payment.findOne({ provider: PAYMENT_METHODS.TELEBIRR, providerReference });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.status === PAYMENT_STATUS.PAID) return res.json({ success: true, payment });
    const result = await telebirr.verifyPayment(providerReference);
    const providerStatus = result.data?.status || result.status;
    const providerAmount = result.data?.amount || result.amount;
    const providerCurrency = result.data?.currency || result.currency || 'ETB';
    const paid = providerStatus === 'success' && Number(providerAmount) === Number(payment.amount) && providerCurrency === payment.currency;
    payment.status = paid ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED;
    payment.transactionId = result.transactionId || providerReference;
    payment.paidAt = paid ? new Date() : null;
    await payment.save();

    const order = await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: payment.status, transactionId: paid ? payment.transactionId : null }, { new: true });

    // ✅ Emit socket event for payment completion (notifies kitchen of paid orders)
    if (paid && order) {
        const { emitSocketEvent } = require('../utils/socket');
        const orderSummary = order.getSummary();
        orderSummary.paymentStatus = PAYMENT_STATUS.PAID;
        emitSocketEvent('kitchen', 'order:payment', orderSummary);
        emitSocketEvent(`order:${order.orderId}`, 'order:payment', orderSummary);
    }

    return res.json({ success: paid, payment });
};