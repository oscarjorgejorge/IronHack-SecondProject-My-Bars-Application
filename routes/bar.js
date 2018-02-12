const express = require('express');
const router = express.Router();

// const username = session.currentUser.username;

router.get('/profile', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.session.currentUser.username;
  const barname = req.session.currentUser.barname;
  const price = req.session.currentUser.price;
  const location = req.session.currentUser.location;

  console.log(location);

  const data = {
    username,
    barname,
    price,
    location
  };

  res.render('bar/profile', data);
});

module.exports = router;
