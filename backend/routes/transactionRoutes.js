const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const transactionController = require('../controllers/transactionController');

/**
 * @route   POST /api/transactions
 * @desc    Record new transaction in supply chain
 * @access  Private
 * @body    {
 *            batchId: string,
 *            toUserId: number,
 *            transactionType: string,
 *            location: string,
 *            temperature?: number,
 *            humidity?: number,
 *            notes?: string
 *          }
 * @returns {transaction: Object}
 */
router.post('/',
    auth.protect,
    auth.restrictTo('farmer', 'distributor', 'retailer'),
    validate.createTransaction,
    transactionController.createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    List transactions with filters
 * @access  Private
 * @query   {
 *            page: number,
 *            limit: number,
 *            startDate: date,
 *            endDate: date,
 *            type: string,
 *            userId: number,
 *            batchId: string
 *          }
 * @returns {transactions: Array, pagination: Object}
 */
router.get('/',
    auth.protect,
    validate.listTransactions,
    transactionController.listTransactions
);

/**
 * @route   GET /api/transactions/batch/:batchId
 * @desc    Get all transactions for specific batch
 * @access  Private
 * @param   batchId: string
 * @returns {transactions: Array}
 */
router.get('/batch/:batchId',
    auth.protect,
    validate.batchId,
    transactionController.getBatchTransactions
);

/**
 * @route   POST /api/transactions/transfer
 * @desc    Transfer batch ownership
 * @access  Private
 * @body    {
 *            batchId: string,
 *            toUserId: number,
 *            location: string,
 *            temperature?: number,
 *            humidity?: number,
 *            notes?: string
 *          }
 * @returns {
 *           transaction: Object,
 *           blockchainTx: Object
 *         }
 */
router.post('/transfer',
    auth.protect,
    auth.restrictTo('farmer', 'distributor', 'retailer'),
    validate.transferOwnership,
    transactionController.transferOwnership
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction details
 * @access  Private
 * @param   id: string
 * @returns {transaction: Object}
 */
router.get('/:id',
    auth.protect,
    validate.transactionId,
    transactionController.getTransaction
);

/**
 * @route   GET /api/transactions/pending
 * @desc    Get pending transactions for user
 * @access  Private
 * @returns {transactions: Array}
 */
router.get('/pending',
    auth.protect,
    transactionController.getPendingTransactions
);

module.exports = router;