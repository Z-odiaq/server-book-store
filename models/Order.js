const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    books: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    number : {
        type: String,
        required: true
    },
    returnedDate : {
        type: Date,
        required: false
    },
    returnedReason : {
        type: String,
        required: false
    },
    
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    couponCode : {
        type: String,
        required: false
    },
    cardNumber : {
        type: String,
        required: true
    },
    expiryDate : {
        type: String,
        required: true
    },
    cvv : {
        type: String,
        required: true
    },
    cardholderName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    }


},
    {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
