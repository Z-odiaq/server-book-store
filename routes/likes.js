const express = require('express');
const router = express.Router();
const like = require('../controllers/likeController');

//create like
//router.post('/likes', like.createLike);

//get all likes
router.get('/likes', like.getAllLikes);

//get likes by book
router.get('/likes/book/total/:bookId', like.getLikesLegth);
router.get('/likes/book/:bookId', like.getLikesForBook);

router.get('/likes/book/:bookId/:userId', like.isBookLikedByUser);

//delete like
router.post('/likes/', like.toggleLike );



module.exports = router;
