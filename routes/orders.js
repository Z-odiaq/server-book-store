const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

// Create an order
router.post('/orders', orderController.createOrder);

// Read all orders
router.get('/orders', orderController.getAllOrders);

// Read orders for a specific user
router.get('/orders/user/:userId', orderController.getOrdersByUser);

// Read a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update an order
router.put('/orders/:id', orderController.updateOrder);

// Delete an order
router.delete('/orders/:id', orderController.deleteOrder);

//router to test sendmail

module.exports = router;
