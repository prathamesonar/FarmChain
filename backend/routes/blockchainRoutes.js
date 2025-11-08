const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const blockchainController = require('../controllers/blockchainController');
const cache = require('../middleware/cache');

/**
 * @route   GET /api/blockchain/verify/:batchId
 * @desc    Verify batch data integrity
 * @access  Public
 * @param   batchId: string
 * @returns {
 *           verified: boolean,
 *           blockchainHash: string,
 *           databaseHash: string,
 *           timestamp: date
 *         }
 */
router.get('/verify/:batchId',
    validate.batchId,
    cache.checkVerificationCache,
    blockchainController.verifyBatchIntegrity,
    cache.storeVerificationResult
);

/**
 * @route   GET /api/blockchain/history/:batchId
 * @desc    Get complete blockchain history
 * @access  Private
 * @param   batchId: string
 * @returns {
 *           history: Array,
 *           transactions: Array
 *         }
 */
router.get('/history/:batchId',
    auth.protect,
    validate.batchId,
    blockchainController.getBatchHistory
);

/**
 * @route   POST /api/blockchain/sync
 * @desc    Manually sync data to blockchain
 * @access  Private (Admin only)
 * @body    {batchIds?: Array<string>}
 * @returns {
 *           synced: number,
 *           failed: number,
 *           details: Array
 *         }
 */
router.post('/sync',
    auth.protect,
    auth.restrictTo('admin'),
    validate.blockchainSync,
    blockchainController.syncToBlockchain
);

/**
 * @route   GET /api/blockchain/status
 * @desc    Get blockchain sync status
 * @access  Private (Admin only)
 * @returns {
 *           lastSync: date,
 *           pendingSync: number,
 *           networkStatus: string
 *         }
 */
router.get('/status',
    auth.protect,
    auth.restrictTo('admin'),
    blockchainController.getBlockchainStatus
);

/**
 * @route   POST /api/blockchain/verify-multiple
 * @desc    Batch verify multiple records
 * @access  Private
 * @body    {batchIds: Array<string>}
 * @returns {results: Array}
 */
router.post('/verify-multiple',
    auth.protect,
    validate.verifyMultipleBatches,
    blockchainController.verifyMultipleBatches
);

module.exports = router;