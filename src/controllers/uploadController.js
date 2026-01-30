// ========== controllers/uploadController.js ==========
// Handles file uploads with Cloudinary integration and fallback support
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Handle general file upload
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // Handle both Cloudinary and fallback scenarios
  let fileUrl;
  
  // Check if it's a Cloudinary upload
  if (req.file.path && req.file.path.includes('cloudinary')) {
    fileUrl = req.file.path;
    console.log(`✅ File uploaded to Cloudinary: ${fileUrl}`);
  } 
  // Check if it's a fallback memory storage upload
  else if (req.file.buffer) {
    // In fallback mode, we'd typically save to local storage or another service
    // For now, return an error indicating Cloudinary is required for this endpoint
    return res.status(500).json({ 
      success: false, 
      error: 'Cloudinary configuration required for file uploads. Please contact administrator.' 
    });
  }
  
  if (!fileUrl) {
    return res.status(500).json({ 
      success: false, 
      error: 'File upload failed. Invalid configuration.' 
    });
  }
  
  sendSuccess(res, { url: fileUrl }, 'File uploaded successfully');
};

// Handle carousel image upload
exports.uploadCarouselImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  try {
    let fileUrl;
    let publicId = null;
    
    // Handle Cloudinary upload
    if (req.file.path && req.file.path.includes('cloudinary')) {
      fileUrl = req.file.path;
      publicId = req.file.filename || req.file.public_id;
      console.log(`✅ Carousel image uploaded to Cloudinary: ${fileUrl}`);
    }
    // Handle fallback scenario
    else if (req.file.buffer) {
      // In fallback mode, return error indicating Cloudinary is required
      return res.status(500).json({ 
        success: false, 
        error: 'Cloudinary configuration required for carousel images. Please contact administrator.' 
      });
    }
    
    if (!fileUrl) {
      throw new Error('❌ Image upload failed. Invalid configuration.');
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    await carouselCollection.insertOne({ 
      url: fileUrl, 
      publicId: publicId,
      createdAt: new Date() 
    });
    
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
    
    const { cloudinary, isConfigured } = require('../config/cloudinary');
    
    // Check if Cloudinary is configured
    if (!isConfigured || !cloudinary) {
      return res.status(500).json({ 
        success: false, 
        error: 'Cloudinary not configured. Cannot delete images.' 
      });
    }
    
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