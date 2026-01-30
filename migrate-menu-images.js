// Migration script to convert local storage URLs to Cloudinary URLs
// Run this script to fix existing menu items with local image paths

const { MongoClient } = require('mongodb');

async function migrateMenuImages() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://sidharthasahani:sidhartha00@tablebooking.cdcxwge.mongodb.net/restaurant_booking?retryWrites=true&w=majority&ssl=true';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('restaurant_booking');
    const menuCollection = db.collection('food_menu');
    
    // Find all menu items with local storage URLs
    const localUrlItems = await menuCollection.find({
      image_url: { $regex: /^\/uploads\// }
    }).toArray();
    
    console.log(`Found ${localUrlItems.length} menu items with local storage URLs`);
    
    if (localUrlItems.length === 0) {
      console.log('No items need migration');
      return;
    }
    
    // Display items that need fixing
    console.log('\nItems needing migration:');
    localUrlItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.image_url}`);
    });
    
    // For demo purposes, we'll show what the Cloudinary URLs should look like
    console.log('\nMigration needed:');
    console.log('Replace local URLs with Cloudinary URLs like:');
    console.log('- Local: /uploads/some-image.jpg');
    console.log('- Cloudinary: https://res.cloudinary.com/deax3wraz/image/upload/v1234567890/image-name.jpg');
    
    console.log('\nTo fix this:');
    console.log('1. Manually re-upload images for these menu items through the admin panel');
    console.log('2. Or run a bulk migration script that uploads local images to Cloudinary');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateMenuImages();