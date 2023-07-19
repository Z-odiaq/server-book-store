const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
// User registration
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstname, lastname, role } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ email, passwordHash, firstname, lastname, role });

    // Save the user to the database
    const savedUser = await user.save();
    const token = jwt.sign({ userId: savedUser._id }, 'secret_key');

    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret_key');

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Read all users
exports.getAllUsers = (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve users' });
    });
};

// Read a specific user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
};




// Read purchased items of a specific user
exports.getUserPurchasedItems = (req, res) => {
  const userId = req.params.id;

  User.findById(userId).populate('purchased')
    .then(user => {
      if (user) {
        res.json(user.purchased);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve purchased items' });
    });
};

// Add to purchased items
exports.addToPurchasedItems = (req, res) => {
  const userId = req.params.id;
  const { purchased } = req.body;

  User.findById(userId)
    .then(user => {
      user.purchased.push(purchased);
      return user.save();
    })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to add to purchased items' });
    });
};

// Remove from purchased items
exports.removeFromPurchasedItems = (req, res) => {
  const userId = req.params.id;
  const purchasedId = req.params.purchasedId;

  User.findById(userId)
    .then(user => {
      user.purchased.pull(purchasedId);
      return user.save();
    })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to remove from purchased items' });
    });
};

// Update user cart
exports.updateUserCart = (req, res) => {
  const userId = req.params.id;
  const { cart } = req.body;

  User.findById(userId)
    .then(user => {
      user.cart.push(cart);
      return user.save();
    })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update cart' });
    });
};

// Update a user
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  User.findByIdAndUpdate(userId, { username, email, password }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update user' });
    });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (deletedUser) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete user' });
    });
};
