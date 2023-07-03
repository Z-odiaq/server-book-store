const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Read users
router.get('/users', userController.getAllUsers);

// Read a specific user by ID
router.get('/users/:id', userController.getUserById);

// Read favorites of a specific user


// Read purchased items of a specific user
router.get('/users/:id/purchased', userController.getUserPurchasedItems);

// Add to purchased items
router.put('/users/:id/purchased', userController.addToPurchasedItems);

// Remove from purchased items
router.delete('/users/:id/purchased/:purchasedId', userController.removeFromPurchasedItems);

// Update user cart
router.put('/users/:id/cart', userController.updateUserCart);

// Update a user
router.put('/users/:id', userController.updateUser);

// Delete a user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
