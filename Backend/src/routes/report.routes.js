const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateQuery } = require('../middleware/validation.middleware');
const {
    getDailyOrdersReport,
    getSalesReport,
    getPopularItemsReport,
    getPaymentsReport,
    getAllReports,
    getReportById,
    deleteReport
} = require('../controllers/report.controller');
const { validateReportQuery } = require('../validators/report.validator');

router.use(protect);
router.use(authorize('admin', 'ADMIN', 'staff', 'kitchen_staff', 'kitchen', 'foodmaker'));

router.get('/daily', validateQuery(validateReportQuery), getDailyOrdersReport);
router.get('/sales', validateQuery(validateReportQuery), getSalesReport);
router.get('/popular', validateQuery(validateReportQuery), getPopularItemsReport);
router.get('/payments', validateQuery(validateReportQuery), getPaymentsReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

module.exports = router;