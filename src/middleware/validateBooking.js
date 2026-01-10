const { body, validationResult } = require('express-validator');

exports.validateBooking = [
  body('customer_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Valid name required'),
  
  body('customer_email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  
  body('customer_phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Valid 10-digit phone required'),
  
  body('number_of_guests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Guests must be 1-20'),
  
  body('booking_date')
    .isISO8601()
    .withMessage('Valid date required'),
  
  body('booking_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid time required (HH:MM)'),
  
  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];