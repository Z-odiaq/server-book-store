const express = require('express');
const router = express.Router();
const like = require('../controllers/likeController');

//create like
router.post('/likes', like.createLike);

//get all likes
router.get('/likes', like.getAllLikes);

//get likes by book
router.get('/likes/book/:bookId', like.getLikesForBook);

//delete like
router.put('/likes/:id', like.toggleLike );



module.exports = router;
