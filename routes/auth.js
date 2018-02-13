const express = require('express');
const bcrypt = require('bcrypt');

const Bar = require('../models/bar');

const router = express.Router();

const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/bar/profile');
  }

  const username = req.body.username;
  const password = req.body.password;
  const barname = req.body.barname;
  const originalPrice = req.body.price;
  const location = {
    // turn req.body.latitude/long into the number
    coordinates: [Number(req.body.latitude), Number(req.body.longitude)]
  };
  // validations

  if (username === '' || password === '' || barname === '' || originalPrice === '' ||
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

    let price = Math.round(originalPrice * 10) / 10;
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
