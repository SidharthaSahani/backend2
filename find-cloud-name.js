// Cloudinary credentials validation script
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('=== Cloudinary Credentials Validation ===\n');

console.log('Provided credentials:');
console.log('- API Key:', process.env.CLOUDINARY_API_KEY);
console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- API Secret: ***' + (process.env.CLOUDINARY_API_SECRET || '').slice(-4) + '\n');

// Try to extract cloud name from API key pattern
// Cloudinary API keys often have patterns that can help identify the cloud name
const apiKey = process.env.CLOUDINARY_API_KEY;
console.log('Analyzing API key pattern...');

// Common Cloudinary cloud name patterns
const possibleCloudNames = [
  'dpayf8h5r', // what you provided
  'grillsandgather', // based on your project name
  'restaurant', // generic
  'tablebooking', // from your MongoDB URI
  apiKey.substring(0, Math.min(10, apiKey.length)), // first 10 chars of API key
  'my_cloud' // fallback
];

console.log('\nTrying different cloud name possibilities...\n');

async function testCloudName(cloudName) {
  try {
    const testCloudinary = require('cloudinary').v2;
    testCloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    const result = await testCloudinary.api.ping();
    console.log(`✅ SUCCESS with cloud name: ${cloudName}`);
    console.log('   Result:', result);
    return cloudName;
  } catch (error) {
    if (error.http_code === 401 && error.error && error.error.message.includes('cloud_name')) {
      console.log(`❌ FAILED: ${cloudName} (cloud_name mismatch)`);
    } else if (error.http_code === 401) {
      console.log(`❌ FAILED: ${cloudName} (authentication error)`);
    } else {
      console.log(`❌ FAILED: ${cloudName} (${error.message})`);
    }
    return null;
  }
}

async function findCorrectCloudName() {
  for (const name of possibleCloudNames) {
    const result = await testCloudName(name);
    if (result) {
      console.log(`\n🎉 Found correct cloud name: ${result}`);
      console.log('Please update your .env file with:');
      console.log(`CLOUDINARY_CLOUD_NAME=${result}`);
      return result;
    }
  }
  
  console.log('\n❌ Could not find correct cloud name automatically.');
  console.log('Please check your Cloudinary dashboard at: https://cloudinary.com/console');
  console.log('Look for the "Cloud name" in the dashboard header.');
}

findCorrectCloudName();