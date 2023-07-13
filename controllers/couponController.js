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

// Update a coupon
exports.updateCoupon = (req, res) => {
  const couponId = req.params.id;
  const  newCoupon  = req.body;

  Coupon.findByIdAndUpdate(couponId, newCoupon, { new: true })
    .then(coupon => {
      if (coupon) {
        res.json(coupon);
      } else {
        res.status(404).json({ error: 'Coupon not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to update coupon' });
    });
};


//check coupon 
exports.checkCoupon = (req, res) => {
  const couponCode = req.params.code;

  Coupon.find({ code: couponCode }).then(coupon => {
    if (coupon) {
      //check if coupon is expired
      if (coupon[0].expiryDate < Date.now()) {
        return res.status(404).json({ error: 'Coupon is expired' });
      } else if (coupon[0].currentUses >= coupon[0].maxUses) {
        return res.status(404).json({ error: 'Coupon is used up' });
      } else if (coupon[0].discountPercentage > 100 || coupon[0].discountPercentage < 0) {
        return res.status(404).json({ error: 'Coupon is invalid' });
      } else {
        console.log(coupon[0]);
        //if coupon is valid
        return res.json(coupon[0]);
      }

    }
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve coupon' });
  });

};

//get coupon by code
exports.getCouponByCode = (req, res) => {
  console.log(req.params.code);
  const couponCode = req.params.code;
  Coupon.findOne({ code: couponCode })
    .then(coupon => {
      if (coupon) {
        if (coupon.expiryDate < Date.now()) {
          return res.status(404).json({ error: 'Coupon is expired' });
        } else if (coupon.currentUses >= coupon.maxUses) {
          return res.status(404).json({ error: 'Coupon is used up' });
        } else if (coupon.discountPercentage > 100 || coupon.discountPercentage < 0) {
          return res.status(404).json({ error: 'Coupon is invalid' });
        } 
        return res.json(coupon);
      } else {
        return res.status(404).json({ error: 'Coupon not found' });
      }
    })
    .catch(error => {
      console.log(error);
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
