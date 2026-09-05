const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDeliveryOrders,
  getMyDeliveries,
  getMyDeliveryHistory,
  assignDeliveryStaff,
  pickUpOrder,
  markOutForDelivery,
  markDelivered,
  getDeliveryStats,
  getDeliveryStaff
} = require('../controllers/delivery.controller');

// All delivery routes require admin, kitchen, or delivery role.
router.use(protect);
router.use(authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker', 'delivery', 'DELIVERY_STAFF', 'delivery_staff'));

/**
 * @route   GET /api/v1/deliveries
 * @desc    Get delivery orders (filterable by status / report)
 */
router.get('/', getDeliveryOrders);

/**
 * @route   GET /api/v1/deliveries/mine
 * @desc    Deliveries assigned to the current delivery staff
 */
router.get('/mine', getMyDeliveries);

/**
 * @route   GET /api/v1/deliveries/my-history
 * @desc    Delivery history for the current delivery staff
 */
router.get('/my-history', getMyDeliveryHistory);

/**
 * @route   GET /api/v1/deliveries/staff
 * @desc    List delivery staff (assignment dropdown)
 */
router.get('/staff', authorize('admin', 'ADMIN'), getDeliveryStaff);

/**
 * @route   GET /api/v1/deliveries/stats
 * @desc    Delivery statistics
 */
router.get('/stats', getDeliveryStats);

/**
 * @route   PATCH /api/v1/deliveries/:id/assign
 * @desc    Assign delivery staff to a delivery order (admin only)
 */
router.patch('/:id/assign', authorize('admin', 'ADMIN'), assignDeliveryStaff);

/**
 * @route   PATCH /api/v1/deliveries/:id/pickup
 * @desc    Pick up an order from the kitchen (delivery staff)
 */
router.patch('/:id/pickup', pickUpOrder);

/**
 * @route   PATCH /api/v1/deliveries/:id/out-for-delivery
 * @desc    Mark a delivery order as out for delivery
 */
router.patch('/:id/out-for-delivery', markOutForDelivery);

/**
 * @route   PATCH /api/v1/deliveries/:id/delivered
 * @desc    Mark a delivery order as delivered
 */
router.patch('/:id/delivered', markDelivered);

module.exports = router;