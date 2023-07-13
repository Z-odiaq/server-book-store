const mongoose = require('mongoose');

const paymentToken = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  cardId: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  expMonth: {
    type: Number,
    required: true
  },
  expYear: {
    type: Number,
    required: true
  },
  last4: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  clientIp: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const Token = mongoose.model('paymentToken', paymentToken);

module.exports = Token;
