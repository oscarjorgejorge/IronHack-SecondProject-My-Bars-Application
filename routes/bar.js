'use strict';

const express = require('express');
const router = express.Router();

// --- GET Profile
router.get('/profile', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  // --- Collecting data from the session to render it in profile
  const username = req.session.currentUser.username;
  const barname = req.session.currentUser.barname;
  const price = req.session.currentUser.price;
  const address = req.session.currentUser.address;
  const location = req.session.currentUser.location;

  const data = {
    username,
    barname,
    price,
    address,
    location
  };

  res.render('bar/profile', data);
});

module.exports = router;
