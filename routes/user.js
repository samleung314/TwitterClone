const express = require('express');
const router = express.Router();
const User = require('../models/User');




//Gets user profile information
router.get('/:username', function (req, res, next) {
    var username = req.params.username;
    User.findOne({ username: username }, function (err, user) {
        //can't find a user by userid
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json({
                status: 'error'
            });
        }
        else {
            var followersNum = user.followers.length();
            var followingNum = user.following.length();
            res.status(200).json({
                status: 'OK',
                user: {
                    email: user.email,
                    followers: followersNum,
                    following: followingNum
                }
            });
        }
    });
});


//Gets list of users following “username”
router.get('/:username/followers', function (req, res, next) {
    var username = req.params.username;
    var limit = 50; //default : 50
    if (typeof (req.body.limit) !== 'undefined')
    {
        if (req.body.limit > 200)
            limit = 200;
        else
            limit = req.body.limit;
    }
    
    User.findOne({ username: username }, function (err, user) {
        //can't find a user by username
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json(
                "error"
            )
        }
        else {
            var followers = user.followers;

            res.status(200).json({
                status: 'OK',
                //users:
            });
        }
    });


});


//Gets list of users “username” is following
router.get('/:id/following', function (req, res, next) {
    var username = req.params.username;
    var limit = 50; //default : 50
    if (typeof (req.body.limit) !== 'undefined')
    {
        if (req.body.limit > 200)
            limit = 200;
        else
            limit = req.body.limit;
    }
    
    User.findOne({ username: username }, function (err, user) {
        //can't find a user by username
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json(
                "error"
            )
        }
        else {
            var followers = user.followers;

            res.status(200).json({
                status: 'OK',
                //users:
            });
        }
    });


});

module.exports = router;
