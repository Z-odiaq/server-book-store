const Comment = require('../models/Comment');

// Create a comment
exports.createComment = (req, res) => {
  const { bookId, userId, text } = req.body;

  const comment = new Comment({
    book : bookId,
    user : userId,
    test : text
  });

  comment.save()
    .then(savedComment => {
      res.status(201).json(savedComment);
    })
    .catch(error => {
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

  Comment.find({ book : bookId }).populate('user' , 'firstName lastName' )
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
