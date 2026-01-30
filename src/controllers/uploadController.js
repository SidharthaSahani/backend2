// ========== controllers/uploadController.js ==========
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Handle general file upload
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // Ensure we're getting Cloudinary URL
  const fileUrl = req.file.path || req.file.secure_url;
  
  // Validate it's a Cloudinary URL
  if (!fileUrl || !fileUrl.includes('cloudinary')) {
    return res.status(500).json({ 
      success: false, 
      error: 'File not uploaded to Cloudinary. Check configuration.' 
    });
  }
  
  console.log(`✅ File uploaded to Cloudinary: ${fileUrl}`);
  sendSuccess(res, { url: fileUrl }, 'File uploaded successfully');
};

// Handle carousel image upload
exports.uploadCarouselImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  try {
    // Ensure we're getting Cloudinary URL
    const fileUrl = req.file.path || req.file.secure_url;
    
    // Validate it's a Cloudinary URL
    if (!fileUrl || !fileUrl.includes('cloudinary')) {
      throw new Error('❌ Image not uploaded to Cloudinary. Check Cloudinary configuration.');
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    await carouselCollection.insertOne({ 
      url: fileUrl, 
      publicId: req.file.filename || req.file.public_id, // Cloudinary public ID
      createdAt: new Date() 
    });
    
    console.log(`✅ Carousel image uploaded to Cloudinary: ${fileUrl}`);
    sendSuccess(res, { url: fileUrl }, 'Carousel image uploaded successfully');
  } catch (error) {
    console.error('❌ Carousel upload error:', error.message);
    sendError(res, error);
  }
};

// Delete image from Cloudinary (optional utility)
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Public ID is required' 
      });
    }
    
    const { cloudinary } = require('../config/cloudinary');
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      sendSuccess(res, null, 'Image deleted successfully');
    } else {
      sendError(res, new Error('Failed to delete image'));
    }
  } catch (error) {
    sendError(res, error);
  }
};