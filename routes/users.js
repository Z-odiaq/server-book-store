const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// User registration
router.post('/register', async (req, res) => {
  const { } = req.body;

  try {
    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    req.body.passwordHash = await bcrypt.hash(req.body.password, 10);
    delete req.body.password;
    // Create a new user
    const user = new User(req.body);

    // Save the user to the database
    const savedUser = await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
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

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});




// Read users
router.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve users' });
    });
});

// Read a specific user by ID
router.get('/users/:id', (req, res) => {
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
});

router.get('/users/:id/favorites', (req, res) => {
  const userId = req.params.id;
  User.findById(userId).populate('favorites').then(user => {
    res.json(user.favorites);
  }).catch(error => {
    res.status(500).json({ error: 'Failed to retrieve favorites' });
  });
});

//add to favorites
router.put('/users/:id/favorites', (req, res) => {
  const userId = req.params.id;
  const { favorites } = req.body;

  User.findById(userId).then(user => {
    user.favorites.push(favorites);
    user.save().then(user => {
      res.json(user);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to add to favorites' });
    });
  }).catch(error => {
    res.status(500).json({ error: 'Failed to add to favorites' });
  });
});

//remove from favorites 
router.delete('/users/:id/favorites/:favoritesId', (req, res) => {
  const userId = req.params.id;
  const favoritesId = req.params.favoritesId;

  User.findById(userId).then(user => {
    user.favorites.pull(favoritesId);
    user.save().then(user => {
      res.json(user);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to remove from favorites' });
    });
  }).catch(error => {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  });
});


router.get('/users/:id/purchased', (req, res) => {
  const userId = req.params.id;
  User.findById(userId).populate('purchased').then(user => {
    res.json(user.purchased);
  }).catch(error => {
    res.status(500).json({ error: 'Failed to retrieve purchased' });
  });
});

//add to purchased
router.put('/users/:id/purchased', (req, res) => {
  const userId = req.params.id;
  const { purchased } = req.body;

  User.findById(userId).then(user => {
    user.purchased.push(purchased);
    user.save().then(user => {
      res.json(user);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to add to purchased' });
    });
  }).catch(error => {
    res.status(500).json({ error: 'Failed to add to purchased' });
  });
});

//remove from purchased
router.delete('/users/:id/purchased/:purchasedId', (req, res) => {
  const userId = req.params.id;
  const purchasedId = req.params.purchasedId;

  User.findById(userId).then(user => {
    user.purchased.pull(purchasedId);
    user.save().then(user => {
      res.json(user);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to remove from purchased' });
    });
  }).catch(error => {
    res.status(500).json({ error: 'Failed to remove from purchased' });
  });
});

//update cart
router.put('/users/:id/cart', (req, res) => {
  const userId = req.params.id;
  const { cart } = req.body;

  User.findById(userId).then(user => {
    user.cart.push(cart);
    user.save().then(user => {
      res.json(user);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to update cart' });
    });
  }).catch(error => {
    res.status(500).json({ error: 'Failed to update cart' });
  });
});

// Update a user
router.put('/users/:id', (req, res) => {
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
});

// Delete a user
router.delete('/users/:id', (req, res) => {
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
});

module.exports = router;
