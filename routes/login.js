var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'login' });
});

router.post('/', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  console.log("Finding username: " + username + " password: " + password);
  User.findOne({ username: username }, function (err, user) {
    //can't find a user by username
    if (err || !user) {
      console.log("Can't find username");
      res.status(200).json({
        status: 'error',
        error: 'Cannot find username'
      });
    } else {
      if (user.username == username && user.password == password && user.verified) {
        console.log(username + " login success!");
        res.cookie('username', username);
        res.status(200).json({
          status: 'OK'
        });
      } else {
        //the username/password is wrong
        console.log("No such username/password combination or unverified");
        res.status(200).json({
          status: 'error',
          error: 'No such username/password combination or unverified'
        });
      }
    }
  });
});

module.exports = router;