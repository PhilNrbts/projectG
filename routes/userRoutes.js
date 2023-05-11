const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', userController.registerUser);

/**
 * @route POST /api/users/login
 * @description Log in a user
 * @access Public
 */
router.post('/login', userController.loginUser);

/**
 * @route POST /api/users/logout
 * @description Log out a user
 * @access Private
 */
router.post('/logout', authMiddleware, userController.logoutUser);

/**
 * @route PUT /api/users/update/:id
 * @description Update user information
 * @access Private
 */
router.put('/update/:id', authMiddleware, userController.updateUser);

/**
 * @route GET /api/users/game-history/:id
 * @description Get user's game history
 * @access Private
 */
router.get('/game-history/:id', authMiddleware, userController.getUserGameHistory);

/**
 * @route GET /api/users/profile
 * @description Get user's profile information
 * @access Private
 */
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;