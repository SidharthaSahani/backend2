const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Validate Cloudinary credentials
if (!cloudName || !apiKey || !apiSecret) {
  console.warn('⚠️  Cloudinary credentials missing - running in fallback mode');
  console.warn('🔧 Some image upload features may be disabled');
  
  // Fallback configuration for basic functionality
  module.exports = {
    cloudinary: null,
    storage: null,
    fileFilter: null,
    isConfigured: false
  };
  return;
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

console.log('✅ Cloudinary configured successfully');
console.log(`☁️  Cloud Name: ${cloudName}`);

// Create Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_app', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'fill' }, // Auto resize and crop
      { quality: 'auto', fetch_format: 'auto' }   // Auto optimize quality and format
    ],
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      return `image-${timestamp}-${randomString}`;
    }
  }
});

// File filter function (same as before)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'), false);
  }
};

module.exports = {
  cloudinary,
  storage,
  fileFilter,
  isConfigured: true
};