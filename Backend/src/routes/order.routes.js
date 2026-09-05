const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validation.middleware');
const {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    getKitchenOrders
} = require('../controllers/order.controller');
const { validateCreateOrder, validateUpdateOrderStatus, validateCancelOrder } = require('../validators/order.validator');

router.post('/', protect, validateBody(validateCreateOrder), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.patch('/:id/cancel', protect, validateBody(validateCancelOrder), cancelOrder);
router.post('/:id/cancel', protect, validateBody(validateCancelOrder), cancelOrder);
router.patch('/:id/status', protect, authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'), validateBody(validateUpdateOrderStatus), updateOrderStatus);

router.get('/', protect, authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'), getAllOrders);
router.get('/stats', protect, authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'), getOrderStats);
router.get('/kitchen', protect, authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'), getKitchenOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;