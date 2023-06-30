const Book = require('../models/Book');
const User = require('../models/User');
//import objectId
const mongoose = require("mongoose");

exports.createBook = (req, res) => {
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
};
// Read all books
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => {

      res.json(books);
    })
    .catch(error => {
      console.log('failed to retrieve books', error);
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
};

// Read the latest books
exports.getLatestBooks = (req, res) => {
  Book.find().sort({ createdAt: -1 }).limit(5)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
};

// Read top selling books
exports.getTopSellingBooks = (req, res) => {
  Book.find().sort({ sold: -1 }).limit(10)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
};

// Read top rated books
exports.getTopRatedBooks = (req, res) => {
  Book.find().sort({ rating: -1 }).limit(10)
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
};

// Read favorite books by user
exports.getFavoriteBooksByUser = (req, res) => {
  const userId = req.params.userId;
  User.findById(userId).populate('favorites')
    .then(user => {
      if (user) {
        res.json(user.favorites);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
};

// Read purchased books by user
exports.getPurchasedBooksByUser = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId).populate('purchasedBooks')
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
};

// Read a specific book by ID
exports.getBookById = (req, res) => {
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
};

// Update a book
exports.updateBook = (req, res) => {
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
};

// Delete a book
exports.deleteBook = (req, res) => {
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
};

//search books
exports.searchBooks = (req, res) => {
  const query = req.query.q;

  Book.find({ title: { $regex: query, $options: 'i' } })
    .then(books => {
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
    });
}

