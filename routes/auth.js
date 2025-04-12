const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Campus Bridge',
    user: req.user 
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Campus Bridge',
    user: req.user 
  });
});

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      req.flash('error', info.message || 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Redirect based on user role
      switch (user.role) {
        case 'student':
          return res.redirect('/student/dashboard');
        case 'faculty':
          return res.redirect('/faculty/dashboard');
        case 'admin':
          return res.redirect('/admin/dashboard');
        default:
          return res.redirect('/');
      }
    });
  })(req, res, next);
});

// Handle register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      req.flash("error", "User already exists.");
      return res.redirect('/auth/register');
    }

    // Create new user
    const newUser = new User({ username, email, role });
    const registeredUser = await User.register(newUser, password);

    // Log in the user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Error during login after registration");
        return res.redirect('/auth/login');
      }

      // Redirect based on user role
      switch (registeredUser.role) {
        case 'student':
          return res.redirect('/student/dashboard');
        case 'faculty':
          return res.redirect('/faculty/dashboard');
        case 'admin':
          return res.redirect('/admin/dashboard');
        default:
          return res.redirect('/');
      }
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed. Try again.");
    res.redirect('/auth/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;