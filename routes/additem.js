var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Item = require('../models/Item');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'additem' });
});

router.post('/', function (req, res, next) {
  // check if logged in
  if (typeof (req.cookies.username) == 'undefined') {
    res.status(200).json({
      status: 'error',
      error: 'No current user'
    });
    return;
  }
  
  var content = req.body.content;
  var childType = null;
  if (typeof (req.body.childType) !== 'undefined') childType = req.body.childType;

  var newItem = new Item({
    id: mongoose.Types.ObjectId(),
    username: req.cookies.username,
    property: {
      likes: 0
    },
    retweeted: 0,
    content: content,
    timestamp: Math.floor(Date.now() / 1000)
  });

  newItem.save(function (err, newItem) {
    if (err) return console.error(err);
    else console.log("Item Saved!");
    res.status(200).json({
      status: 'OK',
      id: newItem.id
    });
  });
});

module.exports = router;