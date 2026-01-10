const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const tableController = require('../controllers/tableController');

// PUBLIC - Customers need to see tables to book
router.get('/', asyncHandler(tableController.getAllTables));

// PROTECTED - Only admins can manage
router.post('/', adminAuth, asyncHandler(tableController.createTable));
router.put('/:id', adminAuth, asyncHandler(tableController.updateTable));
router.delete('/:id', adminAuth, asyncHandler(tableController.deleteTable));

module.exports = router;