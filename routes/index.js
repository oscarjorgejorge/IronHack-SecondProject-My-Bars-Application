const express = require('express');
const router = express.Router();

const Bar = require('../models/bar');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('main/index');
});

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
