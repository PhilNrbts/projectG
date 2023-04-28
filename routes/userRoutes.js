// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authMiddleware, userController.logoutUser);
router.put('/update/:id', authMiddleware, userController.updateUser);
router.get('/game-history/:id', authMiddleware, userController.getUserGameHistory);
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;