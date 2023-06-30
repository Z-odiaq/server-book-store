const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');

// Create an order and update book sold
exports.createOrder = async (req, res) => {
  try {
    const { books, total, returnedReason, couponCode, cardNumber, expiryDate, cvv, cardholderName } = req.body;

    // Check if the quantity of each book is still available
    for (const book of books) {
      const bookData = await Book.findById(book._id);
      if (bookData.quantity < book.quantity) {
        return res.status(400).json({ error: 'The quantity of the book is not available' });
      }
    }

    // Calculate the original total
    let originalTotal = 0;
    for (const book of books) {
      const bookData = await Book.findById(book._id);
      originalTotal += bookData.price * book.quantity;
    }

    // Check if the coupon code is valid
    let calculatedTotal = total;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        calculatedTotal = total - (total * coupon.discountPercentage / 100);
      } else {
        return res.status(400).json({ error: 'Invalid coupon code' });
      }
    }

    if (calculatedTotal !== originalTotal) {
      console.log("total is not equal to original total", calculatedTotal, originalTotal);
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    const order = new Order({
      user: req.body.id,
      books: books,
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

    const savedOrder = await order.save();

    // Update book sold
    for (const book of savedOrder.books) {
      const bookData = await Book.findById(book._id);
      bookData.sold += book.quantity;
      bookData.quantity -= book.quantity;
      await bookData.save();
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Read all orders
exports.getAllOrders = (req, res) => {
  Order.find()
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    });
};

// Read orders for a specific user
exports.getOrdersByUser = (req, res) => {
  const userId = req.params.userId;

  Order.find({ user: userId })
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    });
};

// Read a specific order by ID
exports.getOrderById = (req, res) => {
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
};

// Update an order
exports.updateOrder = (req, res) => {
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
};

// Delete an order
exports.deleteOrder = (req, res) => {
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
};
