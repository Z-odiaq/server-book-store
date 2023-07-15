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
  const { bookId, userId } = req.body;
  Like.findOne({ book: bookId, user: userId })
    .then(like => {
      if (like) {
        Like.findByIdAndDelete(like._id)
          .then(() => {
            res.json({ liked: false });
          })
          .catch(error => {
            res.status(500).json({ error: 'Failed to delete like' });
          });
      } else {
        const newLike = new Like({
          book: bookId,
          user: userId
        });
        newLike.save()
          .then(savedLike => {
            res.status(201).json({ liked: true });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Failed to create like' });
          });
      }
    })
    .catch(error => {
      console.log(error);

      res.status(500).json({ error: 'Failed to retrieve like' });
    });
};

//check if a book is liked by a user
exports.isBookLikedByUser = (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.params.userId;

  Like.findOne({ book: bookId, user: userId })
    .then(like => {
      if (like) {
        res.json({ liked: true });
      } else {
        res.json({ liked: false });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to retrieve like' });
    });
}

//get likes legth for a specific book getLikesLegth
exports.getLikesLegth = (req, res) => {
  const bookId = req.params.bookId;

  Like.find({ book: bookId })
    .then(likes => {

      res.json({'Lenght':likes.length});
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve likes' });
    });
}





