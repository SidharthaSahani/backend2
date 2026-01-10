const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validateBooking');

// PUBLIC - Customers can create bookings
router.post('/', asyncHandler(bookingController.createBooking));

// PUBLIC - Both customers and admins can view bookings to check availability
router.get('/', asyncHandler(bookingController.getAllBookings));
router.put('/:id', adminAuth, asyncHandler(bookingController.updateBooking));
router.delete('/:id', adminAuth, asyncHandler(bookingController.deleteBooking));
router.put('/table/:tableId', adminAuth, asyncHandler(bookingController.completeBookingsByTableId));
router.delete('/table/:tableId', adminAuth, asyncHandler(bookingController.deleteBookingsByTableId));

// Add validation
router.post('/', validateBooking, asyncHandler(bookingController.createBooking));

module.exports = router;