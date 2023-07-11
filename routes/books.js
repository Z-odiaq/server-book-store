const express = require('express');
const router = express.Router();
const bookController = require('../controllers/booksController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename
    },
  });
  const upload = multer({ storage: storage });

router.post('/books',  bookController.createBook);
router.post('/bookxs', upload.fields([{ name: 'coverPic', maxCount: 1 }, { name: 'pdfVersion', maxCount: 1 }]), bookController.createBook);
router.get('/books/search', bookController.searchBooks);
router.get('/books/search/filtre', bookController.searchByFilters);
router.get('/books',bookController.getAllBooks);
router.get('/books/latest', bookController.getLatestBooks);
router.get('/books/top-selling', bookController.getTopSellingBooks);

router.post('/books/favorites', bookController.addToFavorites);
router.get('/books/favorite/:userId', bookController.getUserFavorites);

router.get('/books/top-rated', bookController.getTopRatedBooks);
router.get('/books/purchased/:userId', bookController.getPurchasedBooksByUser);
router.get('/books/:id', bookController.getBookById);
router.put('/books/:id',  bookController.updateBook);

router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
