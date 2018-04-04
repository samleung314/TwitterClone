const express = require('express');
const async = require('async');
const router = express.Router();
const User = require('../models/User');



//Gets user profile information
router.get('/:id', function (req, res, next) {
    var currentUserId = req.cookies.userId;
    var username = req.cookies.username;

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
router.get('/:id/followers', function (req, res, next) {



});


//Gets list of users “username” is following
router.get('/:id/following', function (req, res, next) {



});

module.exports = router;
