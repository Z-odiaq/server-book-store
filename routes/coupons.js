const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
// Read a specific coupon by code
router.get('/coupons/code/:code', couponController.getCouponByCode);
// Create a coupon
router.post('/coupons', couponController.createCoupon);

// Read all coupons
router.get('/coupons', couponController.getAllCoupons);

// Read a specific coupon by ID
router.get('/coupons/:id', couponController.getCouponById);



// Update a coupon
router.put('/coupons/:id', couponController.updateCoupon);

// Delete a coupon
router.delete('/coupons/:id', couponController.deleteCoupon);

//apply coupon
router.post('/coupons/check/:code', couponController.checkCoupon);

module.exports = router;
