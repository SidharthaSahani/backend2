const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const carouselController = require('../controllers/carouselController');
const { upload } = require('../config/multer');

// PUBLIC - Anyone can view
router.get('/', asyncHandler(carouselController.getCarouselImages));

// PROTECTED - Only admins can modify
router.post('/', adminAuth, asyncHandler(carouselController.updateCarouselImages));
router.put('/:index', adminAuth, upload.single('image'), asyncHandler(carouselController.updateCarouselImage));
router.delete('/:index', adminAuth, asyncHandler(carouselController.deleteCarouselImage));

module.exports = router;