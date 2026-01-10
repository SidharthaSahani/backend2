// ============================================
// FILE 2: backend/src/middleware/adminAuth.js - BETTER ERROR LOGGING
// ============================================
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // ✅ Added: Check if token looks like a JWT (3 parts separated by dots)
    if (!token || token.split('.').length !== 3) {
      console.error('❌ Auth error: Malformed token format');
      return res.status(401).json({
        success: false,
        error: 'Invalid token format.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.admin = {
      email: decoded.email,
      role: decoded.role,
      loginTime: decoded.loginTime
    };
    
    // ✅ Reduced logging - only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Admin authenticated:', decoded.email);
    }
    
    next();
    
  } catch (error) {
    // ✅ Better error handling
    console.error('❌ Auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Authentication failed.'
    });
  }
};

module.exports = adminAuth;