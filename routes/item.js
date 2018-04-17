var express = require('express');
var router = express.Router();
var Item = require('../models/Item');

/* GET */
router.get('/:id', function (req, res, next) {
  Item.findOne({ id: req.params.id }, function (err, item) {
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
          property: item.property.likes,
          retweeted: item.retweeted,
          content: item.content,
          timestamp: Math.floor(Date.now() / 1000),
          childType: item.childType,
          parent: item.parent,
          media: item.media
        }
      });
    }
  });
});

/* DELETE */
router.delete('/:id', function (req, res, next) {
  console.log("DELETE");
  var targetId = req.params.id;
  Item.find({ id: targetId }).remove(function (err, item) {
    if (err || !item) {
      console.log("Can't find item");
      res.status(204).end();
    } else {
      res.status(200).json({
        status: 'OK'
      });
    }
  });
});

//LIKE
router.post('/:id/like', function (req, res, next) {
  var like = true;
  var id = req.params.id;

  if (typeof (req.body.like) !== 'undefined') like = req.body.like;

  Item.findOne({ id: id }, function (err, item) {
    if (err || !item) {
      console.log("Can't find item");
      res.status(200).json({
        status: 'error',
      });
      return;
    }
    else {
      if (like) {
        console.log("IN LIKE CLAUSE");

        Item.update(
          { id: id },
          { $inc: { "property.likes": 1 } }
        ).exec(function (err, x) {
          if (err) {

          }
          else {
            console.log("Liked!");
            res.status(200).json({
            status: 'OK'
            });
          }
        });

      }
      else {
        var c = item.property.likes;
        if (c > 0) {
          Item.update(
            { id: id },
            { $inc: { 'property.likes': -1 } }
          ).exec(function (err, x) {
            if (err) {
  
            }
            else {
              console.log("Unliked!");
              res.status(200).json({
              status: 'OK'
              });
            }
          });
        }
      }
    }
  })
})

module.exports = router;