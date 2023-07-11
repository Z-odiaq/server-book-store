const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

try {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB.");
} catch (e) {
  console.log("Failed to initiate mongo.");
  console.log(e);
  throw e;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Import your routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const couponsRouter = require('./routes/coupons');
const ordersRouter = require('./routes/orders');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
// Use your routes
app.use('/api/', booksRouter);
app.use('/api/', usersRouter);
app.use('/api/', couponsRouter);
app.use('/api/', ordersRouter);
app.use('/api/', commentsRouter);
app.use('/api/', likesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
