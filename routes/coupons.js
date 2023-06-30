const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a coupon
router.post('/coupons', couponController.createCoupon);

// Read all coupons
router.get('/coupons', couponController.getAllCoupons);

// Read a specific coupon by ID
router.get('/coupons/:id', couponController.getCouponById);

// Read a specific coupon by code
router.get('/coupons/code/:code', couponController.getCouponByCode);

// Update a coupon
router.put('/coupons/:id', couponController.updateCoupon);

// Delete a coupon
router.delete('/coupons/:id', couponController.deleteCoupon);

module.exports = router;