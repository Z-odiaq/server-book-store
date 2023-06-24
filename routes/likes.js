const express = require('express');
const router = express.Router();
const Like = require('../models/Like');

// Create a like
router.post('/likes', (req, res) => {
  const { bookId, userId } = req.body;

  const like = new Like({
    bookId,
    userId
  });

  like.save()
    .then(savedLike => {
      res.status(201).json(savedLike);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create like' });
    });
});

// Read likes
router.get('/likes', (req, res) => {
  Like.find()
    .then(likes => {
      res.json(likes);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
});

// Read likes for a specific book
router.get('/likes/book/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  Like.find({ bookId })
    .then(likes => {
      res.json(likes);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
});

// Read likes by a specific user
router.get('/likes/user/:userId', (req, res) => {
  const userId = req.params.userId;

  Like.find({ userId })
    .then(likes => {
      res.json(likes);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
});

// Delete a like
router.delete('/likes/:id', (req, res) => {
  const likeId = req.params.id;

  Like.findByIdAndDelete(likeId)
    .then(deletedLike => {
      if (deletedLike) {
        res.json({ message: 'Like deleted successfully' });
      } else {
        res.status(404).json({ error: 'Like not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete like' });
    });
});

module.exports = router;
