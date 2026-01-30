// Test Cloudinary integration
const { cloudinary } = require('./src/config/cloudinary');

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test upload with a simple image URL
    const result = await cloudinary.uploader.upload(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      {
        folder: 'restaurant_app_test',
        public_id: 'test_image_' + Date.now()
      }
    );
    
    console.log('✅ Upload successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    console.log('Folder:', result.folder);
    
    // Test deletion
    const deleteResult = await cloudinary.uploader.destroy(result.public_id);
    console.log('✅ Deletion successful:', deleteResult.result);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCloudinary();