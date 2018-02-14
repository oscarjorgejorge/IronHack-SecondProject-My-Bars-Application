'use strict';
const express = require('express');
const bcrypt = require('bcrypt');
const NodeGeocoder = require('node-geocoder');
const Bar = require('../models/bar');

const router = express.Router();

const bcryptSalt = 10;

// --- GET Signup
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }
  res.render('auth/signup');
});

// --- POST Signup
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }

  const username = req.body.username;
  const password = req.body.password;
  const barname = req.body.barname;

  const originalPrice = req.body.price;
  let price = Math.round(originalPrice * 10) / 10;

  // --- address using with geocoder
  const address = req.body.address;
  let location = {
    coordinates: []
  };

  // --- data validation for signup
  if (username === '' || password === '' || barname === '' || originalPrice === '' ||
  address === '' || password.length < 6) {
    const data = {
      message: 'Try again'
    };
    return res.render('auth/signup', data);
  }

  // --- check if user with this username already exists
  Bar.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }

    // --- optional settings for geocoder
    const options = {
      // provider: 'google',
      // httpAdapter: 'https', // Default
      apiKey: 'AIzaSyCHO4Ne2WFbA6IEdXP_XwzyhlvE0QphapU'
      // formatter: null
    };

    // -- transform address into latitude and longitude, optional settings, no needed
    const geocoder = NodeGeocoder(options);
    geocoder.geocode(address)
      .then((result) => {
        location.coordinates.push(Number(result[0].latitude));
        location.coordinates.push(Number(result[0].longitude));

        // --- password encryption
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        // --- create and save new model in database, inside of geocode for asynchronous js
        const newBar = new Bar({
          username,
          password: hashPass,
          barname,
          price,
          location,
          address
        });

        newBar.save((error) => {
          if (error) {
            return next(error);
          }
          // --- storing the new bar in session
          req.session.currentUser = newBar;
          console.log(req);
          res.redirect('/bar/profile');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// --- GET Login
router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }
  res.render('auth/login');
});

// --- POST Login
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  // --- check if the fields are not empty
  if (username === '' || password === '') {
    const data = {
      message: 'Indicate a username and a password to sign up'
    };
    return res.render('auth/login', data);
  }

  // --- check if the username exist
  Bar.findOne({ 'username': username }, (err, bar) => {
    if (err) {
      return next(err);
    }

    if (!bar) {
      const data = {
        message: 'Username is incorrect'
      };
      return res.render('auth/login', data);
    }

    // --- check if the password is correct
    if (bcrypt.compareSync(password, bar.password)) {
      req.session.currentUser = bar;
      res.redirect('/bar/profile');
    } else {
      const data = {
        message: 'Password is incorrect'
      };
      res.render('auth/login', data);
    }
  });
});

// --- POST Logout
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
