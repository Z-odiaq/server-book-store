const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentsController');

router.post('/comments', commentController.createComment);
router.get('/comments', commentController.getAllComments);
router.get('/comments/book/:bookId', commentController.getCommentsByBook);
router.delete('/comments/:id', commentController.deleteComment);
router.put('/comments', commentController.updateComment);

module.exports = router;
