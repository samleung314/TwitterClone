var express = require('express');
var router = express.Router();

var User = require('../models/UserRemote');
var Item = require('../models/Item');

router.post('/', function (req, res, next) {
  // default values
  var now = Math.floor(Date.now() / 1000);
  var time = now;
  var limit = 25;
  var q = '';
  var username = '';
  var following = true;

  var currentUser = req.cookies.username;

  var error = false;
  if (typeof (req.body.timestamp) !== 'undefined') time = req.body.timestamp;
  if (typeof (req.body.limit) !== 'undefined') limit = Number(req.body.limit);
  if (typeof (req.body.q) !== 'undefined') q = req.body.q;
  if (typeof (req.body.username) !== 'undefined') username = req.body.username;
  if (typeof (req.body.following) !== 'undefined') following = req.body.following;
  if (time > now || limit > 100 || limit < 0) error = true;

  console.log("Search: " + req.body);
  if(following == 'false') following = false;
  if(following == true) console.log(following + " is true");
  if(following == false) console.log(following + " is false");

  if (error) {
    console.log("invalid search");
    res.status(200).json({
      status: 'error',
      error: "Invalid search params"
    });
  }

  function returnUserPosts(user) {
    Item.
      find({
        timestamp: { $lte: time },
        username: user.username,
        content: { $regex: q, $options: "i" }
      }, {
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });
  }

  function returnFollowingPosts() {
    User.findOne({ username: currentUser }, function (err, user) {
      Item.
        find({
          username: { $in: user.following },
          timestamp: { $lte: time },
          content: { $regex: q, $options: "i" }
        },{
          "_id" : 0,
          "__v" : 0
        }).
        limit(limit).
        exec(function (err, docs) {
          if (err) {
            console.log(err);
            res.status(200).json({
              status: 'error'
            });
          } else {
            res.status(200).json({
              status: 'OK',
              items: docs
            });
          }
        });
    });

  }

  function returnAllPosts() {
    Item.
      find({
        timestamp: { $lte: time },
        content: { $regex: q, $options: "i" }
      },{
        "_id" : 0,
        "__v" : 0
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });

  }

  //user given
  if (username) {
    //valid user?
    User.findOne({ username: username }, function levelOne(err, user) {
      //can't find user
      if (err || !user) {
        console.log("Can't find username");
        res.status(200).json({
          status: 'OK',
          items: {}
        });
        return;
        //found user
      } else {
        //following
        if (following) {
          //check logged in user is following username
          if (user.followers.indexOf(currentUser) >= 0) {
            returnUserPosts(user);
          } else {
            res.status(200).json({
              status: 'OK',
              items: {}
            });
            return;
          }

          //not following
        } else {
          returnUserPosts(user);
        }
      }
    });
    //user not given
  } else {
    if (following) {
      returnFollowingPosts();
    } else {
      returnAllPosts();
    }
  }
});

module.exports = router;