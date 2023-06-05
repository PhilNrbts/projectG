// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate the user using JWT.
 * If the user is authenticated, sets the decoded user ID to req.userId and calls the next middleware function.
 *
 * @function
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;