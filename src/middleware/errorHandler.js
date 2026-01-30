// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File size exceeds the 10MB limit'
    });
  }

  // File type validation errors
  if (err.message && (
    err.message.includes('Only image files') || 
    err.message.includes('Invalid file type') ||
    err.message.includes('allowed')
  )) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Cloudinary errors
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(400).json({
      success: false,
      error: 'Image upload failed. Please try again.'
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: `A record with this ${field} already exists`
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;