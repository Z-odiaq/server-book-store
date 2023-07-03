const mongoose = require('mongoose');

// Define the Like schema
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required : true
  }
},
  {
    timestamps: true
  }

);

// Register the Like model
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;

// Now you can use the Like model in your code
