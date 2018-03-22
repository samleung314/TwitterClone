var express = require('express');
var router = express.Router();

/* GET adduser listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome to adduser');
});

module.exports = router;
