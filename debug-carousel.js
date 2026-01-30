// Debug carousel images issue
require('dotenv').config();
const { connectToDatabase, getDatabase } = require('./src/config/database');

async function debugCarouselImages() {
  try {
    console.log('=== Debugging Carousel Images ===\n');
    
    await connectToDatabase();
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    // Get all images from database
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    console.log('Images in database:');
    images.forEach((img, index) => {
      console.log(`${index}: ${img.url}`);
    });
    
    console.log(`\nTotal images: ${images.length}`);
    
    // Test index validation
    const testIndices = [-1, 0, 1, 2, images.length - 1, images.length, images.length + 1];
    
    console.log('\nIndex validation test:');
    testIndices.forEach(index => {
      const isValid = index >= 0 && index < images.length;
      console.log(`Index ${index}: ${isValid ? 'VALID' : 'INVALID'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugCarouselImages();