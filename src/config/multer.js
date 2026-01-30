const multer = require('multer');
const { storage, fileFilter } = require('./cloudinary');

// Create multer instance with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (Cloudinary handles compression)
    files: 1
  },
  fileFilter: fileFilter
});

module.exports = { upload };