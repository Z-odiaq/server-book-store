const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Create a coupon
router.post('/coupons', (req, res) => {
  const { code, discountPercentage, expiryDate, currentUses, maxUses } = req.body;

  const coupon = new Coupon({
    code,
    discountPercentage,
    expiryDate,
    currentUses,
    maxUses
  });

  coupon.save()
    .then(savedCoupon => {
      res.status(201).json(savedCoupon);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create coupon' });
    });
});

// Read coupons
router.get('/coupons', (req, res) => {
  Coupon.find()
    .then(coupons => {
      res.json(coupons);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve coupons' });
    });
});

// Read a specific coupon by ID
router.get('/coupons/:id', (req, res) => {
  const couponId = req.params.id;

  Coupon.findById(couponId)
    .then(coupon => {
      if (coupon) {
        res.json(coupon);
      } else {
        res.status(404).json({ error: 'Coupon not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve coupon' });
    });
});
// Read a specific coupon by code
router.get('/coupons/code/:code', (req, res) => {
    const couponCode = req.params.code;

    Coupon.findOne({ code: couponCode })
        .then(coupon => {
            if (coupon) {
                res.json(coupon);
            } else {
                res.status(404).json({ error: 'Coupon not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to retrieve coupon' });
        });
});


// Update a coupon
router.put('/coupons/:id', (req, res) => {
  const couponId = req.params.id;
  const { code, discountPercentage, expiryDate, currentUses, maxUses } = req.body;

  Coupon.findByIdAndUpdate(couponId, { code, discountPercentage, expiryDate, currentUses, maxUses }, { new: true })
    .then(updatedCoupon => {
      if (updatedCoupon) {
        res.json(updatedCoupon);
      } else {
        res.status(404).json({ error: 'Coupon not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update coupon' });
    });
});

// Delete a coupon
router.delete('/coupons/:id', (req, res) => {
  const couponId = req.params.id;

  Coupon.findByIdAndDelete(couponId)
    .then(deletedCoupon => {
      if (deletedCoupon) {
        res.json({ message: 'Coupon deleted successfully' });
      } else {
        res.status(404).json({ error: 'Coupon not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete coupon' });
    });
});

module.exports = router;
