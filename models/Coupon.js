const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  expiryDate: {
    type: Date,
    required: true
  },
  currentUses: {
    type: Number,
    required: true,
    default: 0
  },
  maxUses: {
    type: Number,
    required: true,
    default: 1
  }
  
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
