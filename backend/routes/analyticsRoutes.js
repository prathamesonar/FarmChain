const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const analyticsController = require('../controllers/analyticsController');
const cache = require('../middleware/cache');

/**
 * @route   GET /api/analytics/overview
 * @desc    Dashboard statistics (role-specific)
 * @access  Private
 * @query   {
 *            startDate?: date,
 *            endDate?: date,
 *            location?: string
 *          }
 * @returns {
 *           batches: Object,
 *           transactions: Object,
 *           quality: Object,
 *           revenue: Object
 *         }
 */
router.get('/overview',
    auth.protect,
    validate.dateRangeQuery,
    cache.checkAnalyticsCache,
    analyticsController.getOverview,
    cache.storeAnalyticsResult
);

/**
 * @route   GET /api/analytics/farmers
 * @desc    Farmer performance metrics
 * @access  Private (Admin/Farmers)
 * @query   {
 *            farmerId?: number,
 *            startDate?: date,
 *            endDate?: date,
 *            metrics?: Array<string>
 *          }
 * @returns {metrics: Object}
 */
router.get('/farmers',
    auth.protect,
    auth.restrictTo('admin', 'farmer'),
    validate.farmerMetrics,
    analyticsController.getFarmerMetrics
);

/**
 * @route   GET /api/analytics/supply-chain
 * @desc    Supply chain efficiency metrics
 * @access  Private
 * @query   {
 *            startDate?: date,
 *            endDate?: date,
 *            batchType?: string,
 *            location?: string
 *          }
 * @returns {
 *           efficiency: Object,
 *           bottlenecks: Array,
 *           recommendations: Array
 *         }
 */
router.get('/supply-chain',
    auth.protect,
    validate.supplyChainMetrics,
    analyticsController.getSupplyChainMetrics
);

/**
 * @route   GET /api/analytics/quality-trends
 * @desc    Quality trends analysis
 * @access  Private
 * @query   {
 *            startDate?: date,
 *            endDate?: date,
 *            cropType?: string
 *          }
 * @returns {trends: Object}
 */
router.get('/quality-trends',
    auth.protect,
    validate.dateRangeQuery,
    analyticsController.getQualityTrends
);

/**
 * @route   GET /api/analytics/reports/export
 * @desc    Export analytics reports
 * @access  Private (Admin only)
 * @query   {
 *            type: string,
 *            format: string,
 *            startDate?: date,
 *            endDate?: date
 *          }
 * @returns {file: Stream}
 */
router.get('/reports/export',
    auth.protect,
    auth.restrictTo('admin'),
    validate.exportReport,
    analyticsController.exportReport
);

module.exports = router;