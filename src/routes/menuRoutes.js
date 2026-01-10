const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const menuController = require('../controllers/menuController');

// PUBLIC - Customers can view menu
router.get('/', asyncHandler(menuController.getAllMenuItems));

// PROTECTED - Only admins can modify
router.post('/', adminAuth, asyncHandler(menuController.createMenuItem));
router.put('/:id', adminAuth, asyncHandler(menuController.updateMenuItem));
router.delete('/:id', adminAuth, asyncHandler(menuController.deleteMenuItem));

module.exports = router;