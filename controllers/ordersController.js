const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});


async function sendCouponCodeEmail(userEmail, coupon) {
  try {
    // Compose the email message
    console.log(process.env.MAILER_PASSWORD);
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: userEmail,
      subject: 'Coupon Code',
      text: `Dear user, your coupon code is: ${coupon.Code}.`,
      html: `<!DOCTYPE html>
      <html>
        <head>
          <title>Special Offer</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f8f8;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
            }
      
            h1 {
              color: #333;
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
      
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 10px;
            }
      
            .coupon {
              background-color: #fff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              padding: 15px;
              margin-bottom: 20px;
            }
      
            .coupon p {
              margin-bottom: 5px;
            }
      
            .coupon-code {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
      
            .coupon-details {
              color: #777;
              font-size: 14px;
            }
      
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Special Offer!</h1>
            <p>Dear valued customer,</p>
            <p>As a token of our appreciation, we are pleased to offer you a special discount coupon:</p>
            <div class="coupon">
              <p class="coupon-code">Coupon Code: ${coupon.Code}</p>
              <p class="coupon-details">Discount: ${coupon.percentage}% off your next purchase</p>
              <p class="coupon-details">Expiration Date: ${coupon.Code.split[T]}</p>
            </div>
            <p>Visit our website or store to redeem this coupon and enjoy great savings on our products.</p>
            <p>Thank you for being a loyal customer!</p>
            <p class="footer">Best regards, <br>Your Company </p>
          </div>
        </body>
      </html>`,

    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


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


    if (total > 100) {
      //create coupon and send it by email
      const coupon = new Coupon({
        code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        discountPercentage: 10,
        expiryDate: new Date().setDate(new Date().getDate() + 30),
        user: req.body.id
      });
      const savedCoupon = await coupon.save().then((coupon) => {
        sendCouponCodeEmail(req.body.email, coupon);
      });
    }
    if (total > 200) {
      //create coupon and send it by email
      const coupon = new Coupon({
        code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        discountPercentage: 15,
        expiryDate: new Date().setDate(new Date().getDate() + 30),
        user: req.body.id
      });
      const savedCoupon = await coupon.save().then((coupon) => {
        sendCouponCodeEmail(req.body.email, coupon);
      });
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
