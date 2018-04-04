var express = require('express');
var router = express.Router();
var Item = require('../model/Item');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'search' });
});

router.post('/', function (req, res, next) {
  // default values
  var now = Math.floor(Date.now() / 1000)
  var time = now;
  var limit = 25;

  var error = false;
  if (typeof (req.body.timestamp) !== 'undefined') time = req.body.timestamp;
  if (typeof (req.body.limit) !== 'undefined') limit = req.body.limit;
  if (time > now || limit > 100 || limit < 0) {
    console.log("invalid search");
    res.status(200).json({
      status: 'error',
      error: "Invalid search params"
    });
  }

  Item.find({ timestamp: { $lte: time }}, function (err, docs) {
    var items = docs.slice(0,limit);
    res.status(200).json({
      status: 'OK',
      items: items
    });
  }); 
});

module.exports = router;