const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Create a book
router.post('/books', (req, res) => {
  const { title, author, price, cover, pages, published, language, genre, rating, description } = req.body;

  const book = new Book({
    title,
    author,
    price,
    cover,
    pages,
    published,
    language,
    genre,
    rating,
    description
  });

  book.save()
    .then(savedBook => {
      res.status(201).json(savedBook);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create book' });
    });
});

// Read books
router.get('/books', (req, res) => {

  //update all books quantity to a random number between 1 and 10
  Book.find().then(books => {
    books.forEach(book => {
      book.quantity = Math.floor(Math.random() * 10) + 1;
      book.save();
    });
  });

  
  Book.find()
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
});

router.get('/books/latest', (req, res) => {
  Book.find().sort({ createdAt: -1 }).limit(5)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
});

//get top selling books
router.get('/books/top-selling', (req, res) => {
  Book.find().sort({ sold: -1 }).limit(10)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
});

//get top rated books
router.get('/books/top-rated', (req, res) => {
  Book.find().sort({ rating: -1 }).limit(10)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
});

//get favorite books by user
router.get('/books/favorite/:userId', (req, res) => {
  const userId = req.params.userId;

  user.findById(userId).populate('favoriteBooks')
    .then(user => {
      if (user) {
        res.json(user.favoriteBooks);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

//get purchased books by user
router.get('/books/purchased/:userId', (req, res) => {
  const userId = req.params.userId;

  user.findById(userId).populate('purchasedBooks')
    .then(user => {
      if (user) {
        res.json(user.purchasedBooks);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// Read a specific book by ID
router.get('/books/:id', (req, res) => {
  const bookId = req.params.id;

  Book.findById(bookId)
    .then(book => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve book' });
    });
});

// Update a book
router.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, price, cover, pages, published, language, genre, rating, description } = req.body;

  Book.findByIdAndUpdate(bookId, { title, author, price, cover, pages, published, language, genre, rating, description }, { new: true })
    .then(updatedBook => {
      if (updatedBook) {
        res.json(updatedBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update book' });
    });
});

// Delete a book
router.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
    .then(deletedBook => {
      if (deletedBook) {
        res.json({ message: 'Book deleted successfully' });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete book' });
    });
});

module.exports = router;
