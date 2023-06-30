const Coupon = require('../models/Coupon');

// Create a coupon
exports.createCoupon = (req, res) => {
  const { code, discountPercentage, expiryDate, currentUses, maxUses } = req.body;

  const coupon = new Coupon({
    code,
    discountPercentage,
    expiryDate,
    currentUses,
    maxUses
  });

  coupon.expiryDate = new Date(req.body.expiryDate);
  coupon.save()
    .then(savedCoupon => {
      res.status(201).json(savedCoupon);
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};

// Read all coupons
exports.getAllCoupons = (req, res) => {
  Coupon.find()
    .then(coupons => {
      res.json(coupons);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve coupons' });
    });
};

// Read a specific coupon by ID
exports.getCouponById = (req, res) => {
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
};

// Read a specific coupon by code
exports.getCouponByCode = (req, res) => {
  const couponCode = req.params.code;
console.log('checking', couponCode);

 Coupon.find({ code: couponCode }).then(coupon => {
    if (coupon[0]) {
      coupon = coupon[0];
      //check if coupon is expired
      if (coupon.expiryDate < Date.now()) {
        res.status(404).json({ error: 'Coupon is expired' });
        return;
      }
      //check if coupon is used up
      if (coupon.currentUses >= coupon.maxUses) {
        res.status(404).json({ error: 'Coupon is used up' });
        return;
      }
      //check if coupon is valid
      if (coupon.discountPercentage > 100 || coupon.discountPercentage < 0) {
        res.status(404).json({ error: 'Coupon is invalid' });
        return;
      }
      console.log(coupon.discountPercentage);
      res.json({percentage : coupon.discountPercentage, expiryDate: coupon.expiryDate });
    } else {
      res.status(404).json({ error: 'Coupon not found' });
    }
  })
    .catch(error => {
      console.log(error);
      res.status(500).json({  error });
    });
    
};

// Update a coupon
exports.updateCoupon = (req, res) => {
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
};
//apply coupon 
exports.applyCoupon = (req, res) => {
  const couponCode = req.params.code;
  const { totalPrice } = req.body;

  Coupon.find({ code: couponCode }).then(coupon => {
    if (coupon) {
      //check if coupon is expired
      if (coupon.expiryDate < Date.now()) {
        res.status(404).json({ error: 'Coupon is expired' });
      }
      //check if coupon is used up
      if (coupon.currentUses >= coupon.maxUses) {
        res.status(404).json({ error: 'Coupon is used up' });
      }
      //check if coupon is valid
      if (coupon.discountPercentage > 100 || coupon.discountPercentage < 0) {
        res.status(404).json({ error: 'Coupon is invalid' });
      }
      //apply coupon
      const discount = totalPrice * (coupon.discountPercentage / 100);
      const newTotalPrice = totalPrice - discount;
      //update coupon uses
      coupon.currentUses++;
      coupon.save();
      res.json(newTotalPrice);
    } else {
      res.status(404).json({ error: 'Coupon not found' });
    }
  })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve coupon' });
    });
    
};


// Delete a coupon
exports.deleteCoupon = (req, res) => {
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
};
