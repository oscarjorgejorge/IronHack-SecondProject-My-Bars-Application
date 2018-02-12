const express = require('express');
const bcrypt = require('bcrypt');

const Bar = require('../models/bar');

const router = express.Router();

const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', (req, res, next) => {
  // if (req.session.currentUser) {
  //   return res.redirect('/bar/profile');
  // }
  const data = {};
  res.render('auth/signup', data);
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }

  const username = req.body.username;
  const password = req.body.password;
  const barname = req.body.barname;
  const price = req.body.price;
  const location = {
    type: 'Point',
    // turn req.body.latitude/long into the number
    coordinates: [Number(req.body.latitude), Number(req.body.longitude)]
  };

  // validations

  if (username === '' || password === '' || barname === '' || price === '' ||
  location.coordinates[0] === '' || location.coordinates[1] === '' || password.length < 6) {
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

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newBar = new Bar({
      username,
      password: hashPass,
      barname,
      price,
      location
    });

    newBar.save((error) => {
      if (error) {
        return next(error);
      }
      req.session.currentUser = newBar;
      res.redirect('/bar/profile');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
