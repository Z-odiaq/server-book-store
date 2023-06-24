const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  // Add other properties of a comment as needed
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
