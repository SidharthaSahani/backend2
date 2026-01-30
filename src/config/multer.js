const multer = require('multer');
const { storage, fileFilter, isConfigured } = require('./cloudinary');

let upload;

if (isConfigured && storage) {
  // Cloudinary is configured - use Cloudinary storage
  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1
    },
    fileFilter: fileFilter
  });
  console.log('✅ Multer configured with Cloudinary storage');
} else {
  // Cloudinary not configured - use memory storage as fallback
  console.warn('⚠️  Cloudinary not configured - using memory storage fallback');
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit for memory storage
      files: 1
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'), false);
      }
    }
  });
}

module.exports = { upload };