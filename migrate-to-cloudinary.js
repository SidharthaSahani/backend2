// Migration script: Move local images to Cloudinary
require('dotenv').config();
const { connectToDatabase, getDatabase } = require('./src/config/database');
const { cloudinary } = require('./src/config/cloudinary');
const fs = require('fs');
const path = require('path');

async function migrateImagesToCloudinary() {
  try {
    console.log('=== Starting Image Migration to Cloudinary ===\n');
    
    // Connect to database
    await connectToDatabase();
    const db = getDatabase();
    
    // Get all carousel images
    const carouselImages = await db.collection('carousel_images').find({}).toArray();
    console.log(`Found ${carouselImages.length} carousel images`);
    
    // Get all menu items with images
    const menuItems = await db.collection('menu').find({ image: { $exists: true, $ne: null } }).toArray();
    console.log(`Found ${menuItems.length} menu items with images\n`);
    
    // Process carousel images
    console.log('--- Processing Carousel Images ---');
    for (let i = 0; i < carouselImages.length; i++) {
      const image = carouselImages[i];
      console.log(`\n${i + 1}. Processing: ${image.url}`);
      
      // Check if it's already a Cloudinary URL
      if (image.url.includes('cloudinary.com')) {
        console.log('  ✅ Already on Cloudinary, skipping...');
        continue;
      }
      
      // Extract filename from local URL
      const filename = image.url.split('/').pop();
      const localPath = path.join(__dirname, 'uploads', filename);
      
      // Check if local file exists
      if (!fs.existsSync(localPath)) {
        console.log('  ⚠️  Local file not found, skipping...');
        continue;
      }
      
      try {
        // Upload to Cloudinary
        console.log('  📤 Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'restaurant_app/carousel',
          public_id: `carousel_${Date.now()}_${i}`,
          overwrite: true
        });
        
        console.log('  ✅ Uploaded successfully!');
        console.log('     Cloudinary URL:', result.secure_url);
        
        // Update database
        await db.collection('carousel_images').updateOne(
          { _id: image._id },
          { $set: { url: result.secure_url, publicId: result.public_id } }
        );
        
        console.log('  📝 Database updated');
        
        // Optional: Delete local file
        // fs.unlinkSync(localPath);
        // console.log('  🗑️  Local file deleted');
        
      } catch (error) {
        console.log('  ❌ Upload failed:', error.message);
      }
    }
    
    // Process menu images
    console.log('\n--- Processing Menu Images ---');
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      console.log(`\n${i + 1}. Processing: ${item.name} - ${item.image}`);
      
      // Check if it's already a Cloudinary URL
      if (item.image.includes('cloudinary.com')) {
        console.log('  ✅ Already on Cloudinary, skipping...');
        continue;
      }
      
      // Extract filename from local URL
      const filename = item.image.split('/').pop();
      const localPath = path.join(__dirname, 'uploads', filename);
      
      // Check if local file exists
      if (!fs.existsSync(localPath)) {
        console.log('  ⚠️  Local file not found, skipping...');
        continue;
      }
      
      try {
        // Upload to Cloudinary
        console.log('  📤 Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'restaurant_app/menu',
          public_id: `menu_${item.name.replace(/\s+/g, '_')}_${Date.now()}`,
          overwrite: true
        });
        
        console.log('  ✅ Uploaded successfully!');
        console.log('     Cloudinary URL:', result.secure_url);
        
        // Update database
        await db.collection('menu').updateOne(
          { _id: item._id },
          { $set: { image: result.secure_url } }
        );
        
        console.log('  📝 Database updated');
        
      } catch (error) {
        console.log('  ❌ Upload failed:', error.message);
      }
    }
    
    console.log('\n=== Migration Complete! ===');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error(error.stack);
  }
}

migrateImagesToCloudinary();