const express = require('express');
const router = express.Router();

router.get('/profile', function (req, res, next) {
  res.render('bar/profile');
});

module.exports = router;
