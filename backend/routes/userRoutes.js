const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const userController = require('../controllers/userController');

/**
 * @route   GET /api/users
 * @desc    List all users with pagination
 * @access  Private (Admin only)
 * @query   {
 *            page?: number,
 *            limit?: number,
 *            role?: string,
 *            search?: string,
 *            active?: boolean
 *          }
 * @returns {users: Array, pagination: Object}
 */
router.get('/',
    auth.protect,
    auth.restrictTo('admin'),
    validate.listUsers,
    userController.listUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user details
 * @access  Private (Admin or Self)
 * @param   id: string
 * @returns {user: Object}
 */
router.get('/:id',
    auth.protect,
    validate.userId,
    auth.restrictToOwnerOrAdmin,
    userController.getUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user information
 * @access  Private (Admin or Self)
 * @param   id: string
 * @body    {
 *            name?: string,
 *            email?: string,
 *            phone?: string,
 *            location?: string,
 *            role?: string,
 *            active?: boolean
 *          }
 * @returns {user: Object}
 */
router.put('/:id',
    auth.protect,
    validate.userId,
    auth.restrictToOwnerOrAdmin,
    validate.updateUser,
    userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate user
 * @access  Private (Admin only)
 * @param   id: string
 * @returns {message: string}
 */
router.delete('/:id',
    auth.protect,
    auth.restrictTo('admin'),
    validate.userId,
    userController.deactivateUser
);

/**
 * @route   GET /api/users/roles
 * @desc    Get available user roles
 * @access  Private (Admin only)
 * @returns {roles: Array}
 */
router.get('/roles',
    auth.protect,
    auth.restrictTo('admin'),
    userController.getUserRoles
);

/**
 * @route   POST /api/users/:id/reset-password
 * @desc    Admin reset user password
 * @access  Private (Admin only)
 * @param   id: string
 * @returns {message: string}
 */
router.post('/:id/reset-password',
    auth.protect,
    auth.restrictTo('admin'),
    validate.userId,
    userController.resetUserPassword
);

module.exports = router;