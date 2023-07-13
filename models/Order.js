const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
      }],
    total: {
        type: Number,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    returnedDate: {
        type: Date,
        required: false
    },
    returnedReason: {
        type: String,
        required: false
    },

    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    couponCode: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
        required: false
    },
    paymentToken: {
        type: Schema.Types.ObjectId,
        ref: 'paymentToken',
        required: true
    },

    email: {
        type: String,
        required: true
    }


},
    {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
