const Like = require('../models/Like');

// Create a like
exports.createLike = (req, res) => {
  const { bookId, userId } = req.body;

  const like = new Like({
    book: bookId,
    user: userId
  });

  like.save()
    .then(savedLike => {
      res.status(201).json(savedLike);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create like' });
    });
};
//get all likes
exports.getAllLikes = (req, res) => {
  Like.find()
    .then(likes => {
      res.json(likes);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
};

//get likes for a specific book
exports.getLikesForBook = (req, res) => {
  const bookId = req.params.bookId;

  Like.find({ book: bookId }).populate('user', 'firstname lastname')
    .then(likes => {

      res.json(likes);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
};

//toggle like
exports.toggleLike = (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.params.userId;

  Like.findOne({ book: bookId, user: userId })
    .then(like => {
      if (like) {
        Like.findByIdAndDelete(like._id)
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
      } else {
        const like = new Like({
          book: bookId,
          user: userId
        });

        like.save()
          .then(savedLike => {
            res.status(201).json(savedLike);
          })
          .catch(error => {
            res.status(500).json({ error: 'Failed to create like' });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve like' });
    });
};


