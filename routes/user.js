const express = require('express');
const router = express.Router();
const User = require('../models/User');
var followingName = [];
var followersName = [];




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
            var followersNum = user.followers.length;
            var followingNum = user.following.length;
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

    User.findOne({ username: username }, function (err, user) {
        //can't find a user by username
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json(
                "error"
            )
        }
        else {
            var followersId = user.followers;
 
            for (let i = 0; i< 200 && i<followersId.length ; i++)
            {
                User.findOne({ _id: followersId[i] }, function (err, followersUser) {
                    followersName.push(followersUser.username);
                });
            }

            res.status(200).json({
                status: 'OK',
                users: follwersName
            });

            followersName = [];
        }
    });


});


//Gets list of users “username” is following
router.get('/:username/following', function (req, res, next) {
    var username = req.params.username;
    
    User.findOne({ username: username }, function (err, user) {
        //can't find a user by username
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json(
                "error"
            )
        }
        else {
            var followingId = user.following; //array containing followers' id;
         
            for (let i = 0; i< 200 && i< followingId.length; i++)
            {
                User.findOne({ _id: followingId[i] }, function (err, followingUser) {
                    console.log(followingId[i]);
                    console.log(followingUser.username);
                    
                });
            }
            
            res.status(200).json({
                status: 'OK',
                users: followingName
            });

            followingName = [];
        }
    });


});

module.exports = router;
