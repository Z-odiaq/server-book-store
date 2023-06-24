const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');
// Create a order & update book sold
router.post('/orders', (req, res) => {
  const { books, total, returnedReason, status, couponCode, cardNumber, expiryDate, cvv, cardholderName } = req.body;
  const order = new Order({
    user: req.body.id,
    books: [books],
    total: total,
    number: Math.floor(Math.random() * 1000000000),
    returnedReason: returnedReason,
    status: "Validated",
    couponCode: couponCode,
    cardNumber: cardNumber,
    expiryDate: expiryDate,
    cvv: cvv,
    cardholderName: cardholderName
  });

  //check if the quantity of each book is still available
  books.forEach(book => {
    Book.findById(book._id).then(book => {
      if (book.quantity < book.quantity) {
        return res.status(400).json({ error: 'The quantity of the book is not available' });
      }
    })
  });




  let originalTotal = 0;
  for (let i = 0; i < books.length; i++) {

    originalTotal += Book.findById(books[i]._id).then((b) => { return b.price }) * books[i].quantity;
  }



  // Calculate the original total


  //check if the coupon code is valid
  const coupon = Coupon.findOne({ code: couponCode })

  if (coupon) {
    Oritotal = total - (total * coupon.discount / 100);
  }

  if (Oritotal !== total) {
    console.log("total is not equal to original total", Oritotal, total);
    return res.status(400).json({ error: 'Invalid coupon code' });
  }



  order.save()
    .then(savedOrder => {
      res.status(201).json(savedOrder);
      //update book sold
      savedOrder.bookId.forEach(book => {
        Book.findById(book.bookId)
          .then(book => {
            book.sold += book.quantity;
            book.quantity -= book.quantity;
            book.save();
          })
      })

    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to create order' });
    });
});

// Read orders
router.get('/orders', (req, res) => {
  Order.find()
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    });
});

// Read orders for a specific user
router.get('/orders/user/:userId', (req, res) => {
  const userId = req.params.userId;

  Order.find({ userId })
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    });
});

// Read a specific order by ID
router.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  Order.findById(orderId)
    .then(order => {
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve order' });
    });
});

// Update a order
router.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { quantity, totalPrice } = req.body;

  Order.findByIdAndUpdate(orderId, { quantity, totalPrice }, { new: true })
    .then(updatedOrder => {
      if (updatedOrder) {
        res.json(updatedOrder);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update order' });
    });
});

// Delete a order
router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  Order.findByIdAndDelete(orderId)
    .then(deletedOrder => {
      if (deletedOrder) {
        res.json({ message: 'Order deleted successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete order' });
    });
});




module.exports = router;
