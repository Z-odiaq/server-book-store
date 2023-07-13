const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableQuantity : {
        type: Number,
        default: 1,
        required: true
    },
    sold: {
        type: Number,
        required: false,
        default: 0
    },
    discount: {
        type: Number,
        required: false
    },
    cover: {
        type: String,
    },
    pages: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    PDFLink: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }



},
    {
        timestamps: true
    });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
