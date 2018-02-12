var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  res.render('auth/signup');
});

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});
module.exports = router;
