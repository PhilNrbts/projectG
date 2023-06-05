/**
 * app.js
 *
 * This module sets up the Express application, configures middleware, and establishes a connection to MongoDB.
 */

/**
 * Module dependencies.
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const { MONGO_URI } = require('./config/database');

/**
 * Load environment variables from .env file.
 */
dotenv.config();

/**
 * Create Express application.
 */
const app = express();

/**
 * Middleware for handling CORS and parsing JSON and URL-encoded payloads.
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware for serving static files from the 'public' directory.
 */
app.use(express.static('public'));

/**
 * API routes.
 */
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

/**
 * Route handler for serving the index.html file from the root route.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/**
 * Get port from environment variables or use 5000 as a default.
 */
const PORT = process.env.PORT || 5000;

/**
 * Establish a connection to the MongoDB database.
 */
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch((error) => console.log(error));

/**
 * Export the Express application.
 */
module.exports = app;