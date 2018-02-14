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
  const address = req.body.address;
  let location = {
    // turn req.body.latitude/long into the number
    coordinates: []
  };

  if (username === '' || password === '' || barname === '' || originalPrice === '' ||
  address === '' || password.length < 6) {
    const data = {
      message: 'Try again'
    };
    return res.render('auth/signup', data);
  }

  // check if user with this username already exists
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

    // -- transform address into latitude and longitude, optional settings, no needed
    const options = {
      // provider: 'google',
      // httpAdapter: 'https', // Default
      apiKey: 'AIzaSyCHO4Ne2WFbA6IEdXP_XwzyhlvE0QphapU'
      // formatter: null
    };

    const geocoder = NodeGeocoder(options);
    // let latitude;
    // let longitude;

    geocoder.geocode(address)
      .then((result) => {
        location.coordinates.push(Number(result[0].latitude));
        location.coordinates.push(Number(result[0].longitude));

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

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

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }
  res.render('auth/login');
});

/* handle the POST from the login form. */
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

router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
