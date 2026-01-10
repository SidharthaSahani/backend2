// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'apple@123';

// Mock admin user (in a real app, you'd have a proper user model and database)
let adminUser = {
  id: 'admin',
  email: ADMIN_EMAIL,
  password: bcrypt.hashSync(ADMIN_PASSWORD, 10), // Hash the default password
};

// Login function
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Check if the user is the admin
    if (email === adminUser.email) {
      // Compare password
      const isValidPassword = await bcrypt.compare(password, adminUser.password);
      
      if (isValidPassword) {
        // Generate JWT token
        const token = jwt.sign(
          { 
            id: adminUser.id, 
            email: adminUser.email,
            role: 'admin',
            loginTime: Date.now()
          },
          process.env.JWT_SECRET || 'fallback_secret_key',
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            email: adminUser.email,
            user: {
              id: adminUser.id,
              email: adminUser.email,
              role: 'admin'
            }
          }
        });
      }
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });

  } catch (error) {
    // Log error without exposing sensitive information
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Verify token function
exports.verifyToken = (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.admin.id,
      email: req.admin.email,
      role: req.admin.role
    }
  });
};