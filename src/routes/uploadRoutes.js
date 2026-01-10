const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const uploadController = require('../controllers/uploadController');
const { upload } = require('../config/multer');

// PROTECTED - Only admins can upload
router.post('/', adminAuth, upload.single('image'), asyncHandler(uploadController.uploadFile));
router.post('/carousel', adminAuth, upload.single('image'), asyncHandler(uploadController.uploadCarouselImage));

module.exports = router;