// ========== controllers/carouselController.js ==========
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { ObjectId } = require('mongodb');

// Get all carousel images with IDs
exports.getCarouselImages = async (req, res) => {
  try {
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    // Return images with their IDs for frontend operations
    const imageData = images.map(img => ({
      id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt
    }));
    
    sendSuccess(res, imageData);
  } catch (error) {
    sendError(res, error);
  }
};

// ✅ NEW: Upload single carousel image
exports.addCarouselImage = async (req, res) => {
  try {
    // Adding carousel image
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    // Create the image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Add to database
    const result = await carouselCollection.insertOne({
      url: imageUrl,
      createdAt: new Date()
    });
    
    // Get all images with IDs
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageData = images.map(img => ({
      id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt
    }));
    
    sendSuccess(res, { 
      newImage: { id: result.insertedId.toString(), url: imageUrl },
      images: imageData 
    }, 'Image uploaded successfully');
  } catch (error) {
    // Log error without exposing sensitive information
    console.error('❌ Error adding carousel image:', error.message);
    sendError(res, error);
  }
};

// Update all carousel images (replace all)
exports.updateAllCarouselImages = async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid images array' 
      });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    await carouselCollection.deleteMany({});
    if (images.length > 0) {
      const imageDocs = images.map(url => ({ url, createdAt: new Date() }));
      await carouselCollection.insertMany(imageDocs);
    }
    
    // Return images with IDs
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageData = updatedImages.map(img => ({
      id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt
    }));
    
    sendSuccess(res, { images: imageData }, 'Carousel images updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Delete carousel image by ID
exports.deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image ID is required' 
      });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    // First check if image exists
    const imageToDelete = await carouselCollection.findOne({ _id: ObjectId.createFromHexString(id) });
    
    if (!imageToDelete) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }
    
    // Delete the image
    await carouselCollection.deleteOne({ _id: imageToDelete._id });
    
    // Get updated images
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageData = updatedImages.map(img => ({
      id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt
    }));
    
    sendSuccess(res, { deletedImage: imageToDelete.url, images: imageData }, 'Image deleted successfully');
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid image ID format' 
      });
    }
    sendError(res, error);
  }
};

// Update single carousel image by ID
exports.updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image ID is required' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    // Check if image exists
    const imageToUpdate = await carouselCollection.findOne({ _id: ObjectId.createFromHexString(id) });
    
    if (!imageToUpdate) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }
    
    const newImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    await carouselCollection.updateOne(
      { _id: imageToUpdate._id },
      { $set: { url: newImageUrl, updatedAt: new Date() } }
    );
    
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageData = updatedImages.map(img => ({
      id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt
    }));
    
    sendSuccess(res, { 
      oldImage: imageToUpdate.url, 
      newImage: newImageUrl, 
      images: imageData 
    }, 'Image updated successfully');
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid image ID format' 
      });
    }
    sendError(res, error);
  }
};