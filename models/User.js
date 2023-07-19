const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  likedBooks: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }],
  purchased: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }],
  cart: [{
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
