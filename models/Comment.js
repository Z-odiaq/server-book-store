const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
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
  
  // Add other properties of a comment as needed
}, {
  timestamps: true
}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
