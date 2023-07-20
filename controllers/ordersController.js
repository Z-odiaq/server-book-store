const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');
const nodemailer = require('nodemailer');
require('dotenv').config();
const stripe = require('stripe')(process.env.sk_test);
const PaymentToken = require('../models/paymentToken');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

async function sendOrderConfirmationEmail(userEmail, items, total) {
  try {
    // Compose the email message
    console.log("Items", items);
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: userEmail,
      subject: 'Order Confirmation',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Order Confirmation</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          </head>
          <body>
            <div class="container">
              <h1>Order Confirmation</h1>
              <p>Dear valued customer,</p>
              <p>Thank you for your order. Here are the details:</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item) => `
                    <tr>
                      <td>${item.title}</td>
                      <td>${item.author}</td>
                      <td>${item.genre}</td>
                      <td>${item.price}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              </br>
              <p>Total: ${total}</p>
              <p>Thank you for your purchase!</p>
              <p class="footer">Best regards, <br>Your Company</p>
            </div>
          </body>
        </html>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendCouponCodeEmail(userEmail, coupon) {
  try {
    // Compose the email message
    // console.log(process.env.MAILER_PASSWORD);
    console.log(userEmail, coupon.expiryDate);
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
              <p class="coupon-code">Coupon Code: ${coupon.code}</p>
              <p class="coupon-details">Discount: ${coupon.discountPercentage}% off your next purchase</p>
              <p class="coupon-details">Expiration Date: ${new Date(coupon.expiryDate).toLocaleDateString()}</p>
            </div>
            <p>Visit our website or store to redeem this coupon and enjoy great savings on our products.</p>
            <p>Thank you for being a loyal customer!</p>
            <p class="footer">Best regards, <br>Your Company </p>
          </div>
        </body>
      </html>`,

    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



// Create an order and update book sold
exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const { user, email, books, couponCode, paymentToken } = req.body;
    let Total = 0;

    PurchasedBooks = [];
    for (const id of books) {
      const bookData = await Book.findById(id);
        PurchasedBooks.push(bookData);
        Total += bookData.price ;
    }

    // Check if the coupon code is validd
    if (couponCode) {
      const coupon = await Coupon.findById(couponCode);
      if (coupon) {
        if (coupon.expiryDate < Date.now()) {
          return res.status(400).json({ error: 'Coupon code has expired' });
        }else if (coupon.currentUses >= coupon.maxUses) {
          return res.status(400).json({ error: 'Coupon code has expired' });
        }
        Total = Total - (Total * coupon.discountPercentage / 100);
        coupon.currentUses += 1;
        await coupon.save();

      } else {
        return res.status(400).json({ error: 'Invalid coupon code' });
      }
    }
    const token = new PaymentToken({
      id: paymentToken.id,
      cardId: paymentToken.card.id,
      brand: paymentToken.card.brand,
      country: paymentToken.card.country,
      expMonth: paymentToken.card.exp_month,
      expYear: paymentToken.card.exp_year,
      last4: paymentToken.card.last4,
      name: paymentToken.card.name,
      clientIp: paymentToken.client_ip,
      created: paymentToken.created,
      email: paymentToken.email,
      livemode: paymentToken.livemode,
      type: paymentToken.type,
      used: paymentToken.used
    });
    const newToken = await token.save();

    const order = new Order({
      user: user,
      books: books,
      email: email,
      total: Total,
      number: Math.floor(Math.random() * 1000000000),
      status: "Validated",
      couponCode: couponCode,
      paymentToken: newToken._id,
    });
    const savedOrder = await order.save();


    // Update book sold
    for (const book of savedOrder.books) {
      const bookData = await Book.findById(book._id);
      bookData.sold ++;

      await bookData.save();
    }

    if (Total > 200 || Total > 100) {
      //create coupon and send it by email if achat>200
      const coupon = new Coupon({
        code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        discountPercentage: Total > 200 ? 15 : 10,
        expiryDate: new Date().setDate(new Date().getDate() + 30),
        users: [user]
      });
      coupon.save().then((coupon) => {
        sendCouponCodeEmail(email, coupon);
      });
    }

    sendOrderConfirmationEmail(email, PurchasedBooks, Total);


    return res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create order' });
  }


};

// Read all orders
exports.getAllOrders = (req, res) => {
  Order.find().populate('books').populate('user', 'email')
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
console.log(userId);
  Order.find({ user: userId }).populate('books').populate('couponCode')
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      console.log(error);
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
  const updatedOrder = req.body;

  Order.findByIdAndUpdate(orderId, updatedOrder, { new: true })
    .then(order => {
      if (order) {
        res.json(order);
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
