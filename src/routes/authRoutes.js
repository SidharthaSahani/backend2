const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { adminLogin, verifyToken } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');

// Rate limiter: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to login route
router.post('/login', loginLimiter, adminLogin);
router.get('/verify', adminAuth, verifyToken);

module.exports = router;