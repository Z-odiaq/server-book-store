const Comment = require('../models/Comment');
const mongoose = require('mongoose');
// Create a comment
exports.createComment = (req, res) => {
  const { book, user, text } = req.body;
  console.log(req.body);
  const comment = new Comment({
    book: new mongoose.mongo.ObjectId(book),
    user: new mongoose.mongo.ObjectId(user),
    text: text
  });

  comment.save()
    .then(savedComment => {
      savedComment.populate('user', 'firstname lastname _id avatar createdAt updatedAt').then(populatedComment => {
        res.status(201).json(populatedComment);
      });

    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to create comment' });
    });
};

// Read all comments
exports.getAllComments = (req, res) => {
  Comment.find()
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
};

// Read comments for a specific book
exports.getCommentsByBook = (req, res) => {
  const bookId = req.params.bookId;

  Comment.find({ book: new mongoose.mongo.ObjectId(bookId) }).populate('user', 'firstname lastname _id avatar createdAt updatedAt')
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
};

// Delete a comment
exports.deleteComment = (req, res) => {
  const commentId = req.params.id;

  Comment.findByIdAndDelete(commentId)
    .then(deletedComment => {
      if (deletedComment) {
        res.json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete comment' });
    });
};

// Update a comment
exports.updateComment = (req, res) => {
  const { id, text } = req.body;

  Comment.findByIdAndUpdate(id, { text }, { new: true }).populate('user', 'firstname lastname _id avatar createdAt updatedAt').then(updatedComment => {

    if (updatedComment) {
      res.json(updatedComment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update comment' });
    });
};


