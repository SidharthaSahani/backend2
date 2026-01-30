const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { adminLogin, verifyToken } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');

// Rate limiter: 10 attempts per 1 hour
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to login route
router.post('/login', loginLimiter, adminLogin);
router.get('/verify', adminAuth, verifyToken);

module.exports = router;