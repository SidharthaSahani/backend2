// Detailed Cloudinary test
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Environment variables:');
console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[SET]' : '[NOT SET]');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('\nCloudinary config:');
console.log('- Cloud name:', cloudinary.config().cloud_name);
console.log('- API key:', cloudinary.config().api_key);
console.log('- Secure:', cloudinary.config().secure);

// Test ping
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ Cloudinary ping successful:', result);
    
    // Test upload
    return cloudinary.uploader.upload(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      {
        folder: 'restaurant_app_test',
        public_id: 'test_image_' + Date.now(),
        overwrite: true
      }
    );
  })
  .then(uploadResult => {
    console.log('\n✅ Upload successful!');
    console.log('URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    console.log('Bytes:', uploadResult.bytes);
    
    // Test deletion
    return cloudinary.uploader.destroy(uploadResult.public_id);
  })
  .then(deleteResult => {
    console.log('\n✅ Deletion successful:', deleteResult.result);
    console.log('Delete result:', deleteResult);
  })
  .catch(error => {
    console.error('\n❌ Error details:');
    console.error('Message:', error.message);
    console.error('Code:', error.http_code);
    console.error('Name:', error.name);
    if (error.error) {
      console.error('Cloudinary error:', error.error);
    }
  });