var express = require('express');
var router = express.Router();

var User = require('../models/User');
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
  if (typeof (req.body.limit) !== 'undefined') limit = req.body.limit;
  if (typeof (req.body.q) !== 'undefined') q = req.body.q;
  if (typeof (req.body.username) !== 'undefined') username = req.body.username;
  if (typeof (req.body.following) !== 'undefined') following = req.body.following == "true";
  if (time > now || limit > 100 || limit < 0) error = true;

  console.log("following:" + following)

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
          '_id': 0, 'username': 1, 'property': 1, 'retweeted': 1, 'content': 1, 'timestamp': 1
        }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN USER POSTS");
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
        }).
        limit(limit).
        exec(function (err, docs) {
          if (err) {
            console.log(err);
            res.status(200).json({
              status: 'error'
            });
          } else {
            console.log("RETURN FOLLOWING POSTS");
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
      }).
      limit(limit).
      exec(function (err, docs) {
        if (err) {
          console.log(err);
          res.status(200).json({
            status: 'error'
          });
        } else {
          console.log("RETURN ALL POSTS");
          res.status(200).json({
            status: 'OK',
            items: docs
          });
        }
      });

  }

  //user given
  if (username) {
    console.log("username:" + username)
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
        console.log("found user: " + user.username);
        //following
        if (following) {
          //check logged in user is following username
          if (user.followers.indexOf(currentId) >= 0) {
            returnUserPosts(user);
          } else {
            console.log("Target user is not being followed");
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
      console.log("HELLO")
      returnAllPosts();
    }
  }
});

module.exports = router;