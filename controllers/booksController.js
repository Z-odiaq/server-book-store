const Book = require('../models/Book');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const Order = require('../models/Order');
const mongoose = require("mongoose");


cloudinary.config({
  cloud_name: 'dfxpnludz',
  api_key: '918177626788132',
  api_secret: 'ru9snk5wFZtzPlFm71kqg0r7g1U'
});



// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination folder for temporary storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverPic' || file.fieldname === 'pdfVersion') {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


exports.createBook = async (req, res) => {
  upload.fields([{ name: 'coverPic', maxCount: 1 }, { name: 'pdfVersion', maxCount: 1 }])(req, res, async function (err) {
    if (err) {
      // Handle the error
      console.log(err);
      res.status(500).json({ success: false, message: 'Failed to upload files' });
    } else {
      const uploadCover = req.files.coverPic[0];
      const uploadPdf = req.files.pdfVersion[0];

      try {
        // Upload cover image to Cloudinary
        const coverResult = await cloudinary.uploader.upload(uploadCover.path, {
          folder: 'images',
        });

        // Upload PDF version to Cloudinary
        const pdfResult = await cloudinary.uploader.upload(uploadPdf.path, {
          folder: 'pdfs',
        });
        console.log(coverResult.secure_url + " " + pdfResult.secure_url);

        // Retrieve other form data
        const { title, author, price, genre, description, discount, rating, language, pages, availableQuantity } = req.body;

        // Create the book object with the form data and Cloudinary URLs
        const newBook = new Book({
          title,
          author,
          price,
          genre,
          availableQuantity,
          pages,
          language,
          rating,
          discount,
          description,
          cover: coverResult.secure_url,
          PDFLink: pdfResult.secure_url,
        });

        // Save the new book to the database
        await newBook.save();

        // Return a success response
        res.json({ success: true, message: 'Book created successfully' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to create book', error });
      }
    }
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

// Read favorites of a specific user
exports.getUserFavorites = (req, res) => {
  const userId = req.params.userId;
  console.log("user id", userId);
  User.findById(userId).populate('favorites')
    .then(user => {
      if (user) {
        res.json(user.favorites);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve favorites' });
    });
};

// Add to favorites
exports.addToFavorites = (req, res) => { //book
  const { bookId, userId } = req.body;
  console.log("bookid", req.body);
  User.findById(userId)
    .then(user => {
      bid = new mongoose.mongo.ObjectId(bookId);
      console.log("user", user.favorites, "bid", bid);
      if (user.favorites.includes(bid)) {
        user.favorites.pull(bid);
        user.save();
        return res.status(200).json({ message: 'Book pulled' });
      }
      user.favorites.push(bid);
      user.save();
      return res.status(200).json({ message: 'Book added' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to add to favorites' });
    });
};


// Read purchased books by user
//get list of purchased books by user
exports.getPurchasedBooksByUser = (req, res) => {
  const userId = req.params.userId;

  Order.find({ user: userId }).populate('books')
    .then(orders => {
      let books = [];
      orders.forEach(order => {
        order.books.forEach(book => {
          books.push(book);
        });
      });
      res.json(books);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve books' });
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


  upload.fields([{ name: 'coverPic', maxCount: 1 }, { name: 'pdfVersion', maxCount: 1 }])(req, res, async function (err) {
    if (err) {
      // Handle the error
      console.log(err);
      res.status(500).json({ success: false, message: 'Failed to upload files' });
    } else {


      var PDFLinkUp = req.files && req.files.pdfVersion && req.files.pdfVersion[0];
      PDFLinkUp = PDFLinkUp ?? null;

      var coverUp = req.files && req.files.coverPic && req.files.coverPic[0];
      coverUp = coverUp ?? null;


      try {

        const cover = coverUp ? await cloudinary.uploader.upload(coverUp.path, {
          folder: 'images',
        }) : null;

        const PDFLink = PDFLinkUp ? await cloudinary.uploader.upload(PDFLinkUp.path, {
          folder: 'pdfs',
        }) : null;

        console.log("cover", cover);

        const bookId = req.params.id;
        const { title, author, price, pages, published, language, genre, rating, description } = req.body;

        Book.findByIdAndUpdate(bookId, {
          title, author, price,
          cover: cover?.secure_url,
          PDFLink: PDFLink?.secure_url,
          pages, published, language, genre, rating, description
        }, { new: true })
          .then(updatedBook => {
            if (updatedBook) {
              res.json(updatedBook);
            } else {
              res.status(404).json({ error: 'Book not found' });
            }
          })
          .catch(error => {
            console.log("error: ", error);

            res.status(500).json({ error: 'Failed to update book' });
          });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to upload files' });
      }
    }
  });
};

// Delete a book
exports.deleteBook = (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
    .then(deletedBook => {
      if (deletedBook) {
        //delete the book from the users favorites
        User.updateMany({}, { $pull: { favorites: bookId } })
          .then(() => {
            res.json({ message: 'Book deleted successfully' });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete book' });
    });
};

// Define a route for searching books

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    // Perform the search query
    const searchResults = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });

    res.json({ results: searchResults });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
};

//search by provided filters
exports.searchByFilters = async (req, res) => {
  try {
    const { title, author, genre, language } = req.query;

    // Perform the search query
    const searchResults = await Book.find({
      $or: [
        { title: { $regex: title, $options: 'i' } },
        { genre: { $regex: genre, $options: 'i' } },
        { author: { $regex: author, $options: 'i' } },
        { language: { $regex: language, $options: 'i' } },
      ],
    });

    res.json({ results: searchResults });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
};
