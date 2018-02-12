const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('main/index');
});

router.get('/map', function (req, res, next) {
  res.render('main/map');
});

module.exports = router;
