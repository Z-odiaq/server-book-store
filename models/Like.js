const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Add other properties of a like as needed
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
