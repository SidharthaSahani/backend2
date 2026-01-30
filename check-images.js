const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkImages() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGO_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('grills_gather');
    const collection = db.collection('carousel_images');
    const images = await collection.find({}).toArray();
    
    console.log('Carousel images in database:');
    images.forEach((img, i) => {
      console.log(`${i + 1}. ID: ${img._id}, URL: ${img.url}`);
    });
    
    console.log('\nChecking for HTTP URLs:');
    const httpUrls = images.filter(img => img.url && img.url.startsWith('http://'));
    if (httpUrls.length > 0) {
      console.log('Found HTTP URLs that need to be updated:');
      httpUrls.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url}`);
      });
    } else {
      console.log('No HTTP URLs found.');
    }
  } finally {
    await client.close();
  }
}

checkImages().catch(console.error);
