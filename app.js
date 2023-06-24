var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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

app.use('/api', require('./routes/books'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/coupons'));
app.use('/api', require('./routes/comments'));
app.use('/api', require('./routes/likes'));
app.use('/api', require('./routes/orders'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
