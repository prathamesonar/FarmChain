const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const batchController = require('../controllers/batchController');

/**
 * @route   POST /api/batches
 * @desc    Create a new batch
 * @access  Private (Farmer only)
 * @body    {
 *            cropType: string,
 *            quantity: number,
 *            unit: string,
 *            harvestDate: date,
 *            qualityGrade: string,
 *            location: string
 *          }
 * @returns {batch: Object}
 */
router.post('/',
    auth.protect,
    auth.restrictTo('farmer'),
    validate.createBatch,
    batchController.createBatch
);

/**
 * @route   GET /api/batches
 * @desc    List batches with pagination & filters
 * @access  Private (Role-based visibility)
 * @query   {
 *            page: number,
 *            limit: number,
 *            status: string,
 *            startDate: date,
 *            endDate: date,
 *            farmerId: number,
 *            location: string
 *          }
 * @returns {batches: Array, pagination: Object}
 */
router.get('/',
    auth.protect,
    validate.listBatches,
    batchController.listBatches
);

/**
 * @route   GET /api/batches/:id
 * @desc    Get batch details with supply chain history
 * @access  Private
 * @param   id: string
 * @returns {
 *           batch: Object,
 *           transactions: Array,
 *           qualityReports: Array,
 *           blockchain: Object
 *         }
 */
router.get('/:id',
    auth.protect,
    validate.batchId,
    batchController.getBatchDetails
);

/**
 * @route   PUT /api/batches/:id
 * @desc    Update batch status/location
 * @access  Private (Authorized roles)
 * @param   id: string
 * @body    {
 *            status?: string,
 *            location?: string,
 *            temperature?: number,
 *            humidity?: number
 *          }
 * @returns {batch: Object}
 */
router.put('/:id',
    auth.protect,
    auth.restrictTo('farmer', 'distributor', 'retailer'),
    validate.updateBatch,
    batchController.updateBatch
);

/**
 * @route   DELETE /api/batches/:id
 * @desc    Soft delete batch (admin only)
 * @access  Private (Admin only)
 * @param   id: string
 * @returns {message: string}
 */
router.delete('/:id',
    auth.protect,
    auth.restrictTo('admin'),
    validate.batchId,
    batchController.deleteBatch
);

/**
 * @route   GET /api/batches/:id/verify
 * @desc    Public verification of batch authenticity
 * @access  Public
 * @param   id: string
 * @returns {
 *           verified: boolean,
 *           batch: Object,
 *           blockchain: Object,
 *           history: Array
 *         }
 */
router.get('/:id/verify',
    validate.batchId,
    batchController.verifyBatch
);

/**
 * @route   POST /api/batches/:id/quality
 * @desc    Add quality inspection result
 * @access  Private (Authorized inspector)
 * @param   id: string
 * @body    {
 *            grade: string,
 *            remarks: string,
 *            pesticideUsed: boolean,
 *            organicCertified: boolean
 *          }
 * @returns {report: Object}
 */
router.post('/:id/quality',
    auth.protect,
    auth.restrictTo('inspector', 'manufacturer'),
    validate.qualityInspection,
    batchController.addQualityReport
);

module.exports = router;