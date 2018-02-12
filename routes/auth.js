var express = require('express');
var router = express.Router();

const Bar = require('../models/bar');

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  res.render('auth/signup');
});

router.post('/signup', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const barname = req.body.barname;
  const price = req.body.price;
  const location = {
    type: 'Point',
    // turn req.body.latitude/long into the number
    coordinates: [Number(req.body.latitude), Number(req.body.longitude)]
  };

  const newBar = new Bar({
    username,
    password,
    barname,
    price,
    location
  });

  newBar.save((error) => {
    if (error) {
      return next(error);
    }
    res.render('auth/signup');
  });
});

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});
module.exports = router;
