'use strict';

const express = require('express');
const router = express.Router();
const NodeGeocoder = require('node-geocoder');

const Bar = require('../models/bar');

// --- GET Profile
router.get('/profile', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  // --- Collecting data from the session to render it in profile
  const id = req.session.currentUser._id;
  const username = req.session.currentUser.username;
  const barname = req.session.currentUser.barname;
  const price = req.session.currentUser.price;
  const address = req.session.currentUser.address;
  const location = req.session.currentUser.location;

  const data = {
    id,
    username,
    barname,
    price,
    address,
    location
  };
  res.render('bar/profile', data);
});

// --- GET EDIT Profile
router.get('/profile/:barId/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  Bar.findById(req.params.barId, (error, bar) => {
    if (error) {
      next(error);
    } else {
      const data = {
        Id: bar._id,
        username: bar.username,
        barname: bar.barname,
        price: bar.price,
        address: bar.address
      };

      res.render('bar/edit', data);
    }
  });
});

// --- POST Profile
router.post('/profile', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  // --- Colect data from the edit form
  const barname = req.body.barname;
  const originalPrice = req.body.price;
  let price = Math.round(originalPrice * 10) / 10;
  const address = req.body.address;
  const location = { type: 'Point',
    coordinates: []
  };

  const updates = {
    barname,
    price,
    address,
    location
  };

  const id = req.session.currentUser._id;

  // --- data validation for edit form
  if (barname === '' || originalPrice === '' ||
  address === '') {
    const data = {
      message: 'Try again'
    };
    return res.render('/bar/profile/' + id + '/edit', data);
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
    })
    // --- update database and update information in session.currentUser
    .then(() => {
      Bar.findByIdAndUpdate(id, updates, {new: true}, (err, newInfo) => {
        console.log(newInfo);
        if (err) {
          return next(err);
        }
        req.session.currentUser = newInfo;

        return res.redirect('/bar/profile');
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
