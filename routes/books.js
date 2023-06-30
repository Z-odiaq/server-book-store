const express = require('express');
const router = express.Router();
const bookController = require('../controllers/booksController');

router.post('/books', bookController.createBook);
router.get('/books', bookController.getAllBooks);
router.get('/books/latest', bookController.getLatestBooks);
router.get('/books/top-selling', bookController.getTopSellingBooks);
router.get('/books/top-rated', bookController.getTopRatedBooks);
router.get('/books/favorite/:userId', bookController.getFavoriteBooksByUser);
router.get('/books/purchased/:userId', bookController.getPurchasedBooksByUser);
router.get('/books/:id', bookController.getBookById);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
