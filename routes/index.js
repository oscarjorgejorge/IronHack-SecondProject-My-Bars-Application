'use strict';

const express = require('express');
const router = express.Router();

const Bar = require('../models/bar');

// --- GET Home Page
router.get('/', (req, res, next) => {
  res.render('main/index');
});

// --- GET Map
router.get('/map', (req, res, next) => {
  Bar.find((error, bars) => {
    if (error) {
      next(error);
    } else {
      res.render('main/map', {bars});
    }
  });
});

module.exports = router;
