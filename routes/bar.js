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

  const originalPrice = req.body.price;
  const updates = {
    username: req.body.username,
    barname: req.body.barname,
    price: Math.round(originalPrice * 10) / 10,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: []
    }
  };
  const id = req.session.currentUser._id;
  // const username = req.body.username;
  // const barname = req.body.barname;

  // let price = Math.round(originalPrice * 10) / 10;

  // // --- address using with geocoder
  // const address = req.body.address;
  // let location = {
  //   coordinates: []
  // };

  // --- data validation for edit
  if (updates.username === '' || updates.barname === '' || originalPrice === '' ||
  updates.address === '') {
    const data = {
      message: 'Try again'
    };
    return res.render('/bar/profile/' + id + '/edit', data);
  }

  // edited res.render

  // --- check if new username already exists
  // Bar.findOne({ 'username': updates.username }, (err, user) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (user && user.username !== updates.username) {
  //     const data = {
  //       message: 'The "' + updates.username + '" username is taken'
  //     };
  //     return res.render('/bar/profile/' + id + '/edit', data);
  //   }
  // });

  // --- optional settings for geocoder
  const options = {
    // provider: 'google',
    // httpAdapter: 'https', // Default
    apiKey: 'AIzaSyCHO4Ne2WFbA6IEdXP_XwzyhlvE0QphapU'
    // formatter: null
  };

    // -- transform address into latitude and longitude, optional settings, no needed
  const geocoder = NodeGeocoder(options);
  geocoder.geocode(updates.address)
    .then((result) => {
      updates.location.coordinates.push(Number(result[0].latitude));
      updates.location.coordinates.push(Number(result[0].longitude));
      console.log('updates inside the then etc etc...: ', updates);
      // --- create and save new model in database, inside of geocode for asynchronous js
      // const newBar = new Bar({
      //   username,
      //   barname,
      //   price,
      //   location,
      //   address
      // });

      // const updates = {
      //   username,
      //   barname,
      //   price,
      //   address,
      //   location
      // };
    })
    .then(() => {
      Bar.findByIdAndUpdate(id, updates, (err, paquito) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/bar/profile');
      });

      // newBar.save((error) => {
      //   if (error) {
      //     return next(error);
      //   }
      //   // --- storing the new bar in session
      //   req.session.currentUser = newBar;
      //   console.log(req);
      //   res.redirect('/bar/profile');
      // });
    })
    .then(() => {
      Bar.findOne({ 'username': updates.username }, (err, bar) => {
        if (err) {
          return next(err);
        }
        req.session.currentUser = bar;
        res.redirect('/bar/profile');

        // --- check if the password is correct
        // if (bcrypt.compareSync(password, bar.password)) {
        //   res.redirect('/bar/profile');
        // } else {
        //   const data = {
        //     message: 'Password is incorrect'
        //   };
        //   res.render('auth/login', data);
        // }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
// });

module.exports = router;
