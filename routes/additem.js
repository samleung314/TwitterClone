var express = require('express');
var router = express.Router();
var User = require('../item/Item');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'additem' });
});

router.post('/', function (req, res, next) {
  // check if logged in
  if (typeof (req.cookies.currentUser) == 'undefined') {
    res.status(200).json({
      status: 'error',
      error: 'No current user'
    });
    return;
  }
  
  var content = req.body.content;
  var childType = null;
  if (typeof (req.body.childType) !== 'undefined') childType = req.body.childType;

  var newItem = new User({
    content: content,
    childType: childType
  });

  newItem.save(function (err, newItem) {
    if (err) return console.error(err);
    else console.log("Item Saved!");
    res.status(200).json({
      status: 'OK',
      id: newItem._id
    });
  });
});

module.exports = router;