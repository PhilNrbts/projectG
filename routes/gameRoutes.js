// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 * @route POST /api/games/create
 * @description Create a new game
 * @access Private
 */
router.post('/create', authMiddleware, gameController.createGame);

module.exports = router;