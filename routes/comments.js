const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Create a comment
router.post('/comments', (req, res) => {
  const { bookId, userId, content } = req.body;

  const comment = new Comment({
    bookId,
    userId,
    content
  });

  comment.save()
    .then(savedComment => {
      res.status(201).json(savedComment);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create comment' });
    });
});

// Read comments
router.get('/comments', (req, res) => {
  Comment.find()
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
});

// Read comments for a specific book
router.get('/comments/book/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  Comment.find({ bookId })
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
});

// Read comments by a specific user
router.get('/comments/user/:userId', (req, res) => {
  const userId = req.params.userId;

  Comment.find({ userId })
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
});

// Update a comment
router.put('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  Comment.findByIdAndUpdate(commentId, { content }, { new: true })
    .then(updatedComment => {
      if (updatedComment) {
        res.json(updatedComment);
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update comment' });
    });
});

// Delete a comment
router.delete('/comments/:id', (req, res) => {
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
});

module.exports = router;
