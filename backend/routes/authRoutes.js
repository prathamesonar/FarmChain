const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const authController = require('../controllers/authController');

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window per IP
    message: 'Too many attempts from this IP, please try again after 15 minutes'
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with role assignment
 * @access  Public
 * @body    {
 *            name: string,
 *            email: string,
 *            password: string,
 *            role: enum('farmer', 'distributor', 'retailer', 'admin'),
 *            phone: string,
 *            location: string,
 *            walletAddress: string
 *          }
 * @returns {token: string, user: Object}
 */
router.post('/register',
    validate.registration,
    authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login and receive JWT token
 * @access  Public
 * @body    {email: string, password: string}
 * @returns {token: string, user: Object}
 */
router.post('/login',
    authLimiter,
    validate.login,
    authController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user profile
 * @access  Private
 * @returns {user: Object}
 */
router.get('/profile',
    auth.protect,
    authController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @body    {
 *            name?: string,
 *            phone?: string,
 *            location?: string,
 *            walletAddress?: string
 *          }
 * @returns {user: Object}
 */
router.put('/profile',
    auth.protect,
    validate.profileUpdate,
    authController.updateProfile
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public (with refresh token)
 * @body    {refreshToken: string}
 * @returns {token: string, refreshToken: string}
 */
router.post('/refresh',
    validate.refreshToken,
    authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout and invalidate token
 * @access  Private
 */
router.post('/logout',
    auth.protect,
    authController.logout
);

module.exports = router;