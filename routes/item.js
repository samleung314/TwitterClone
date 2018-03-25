var express = require('express');
var router = express.Router();
var Item = require('../item/Item');

/* GET home page. */
router.get('/:id', function (req, res, next) {
  Item.findOne({ _id: req.params.id }, function (err, item) {
    //can't find a item by username
    if (err || !item) {
      console.log("Can't find item");
      res.status(200).json({
        status: 'error',
        error: 'Cannot find item'
      });
    } else {
      console.log("Found: " + item.id);
      res.status(200).json({
        status: 'OK',
        item: {
                id: item.id,
                username: item.user,
                property: {likes: 0}
              },
        retweeted: 0,
        content: item.content,
        timestamp: Math.floor(Date.now() / 1000)
      });
    }
  });
});

module.exports = router;