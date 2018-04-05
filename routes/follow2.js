const express = require('express');
const async = require('async');
const router = express.Router();
const User = require('../models/User');


//follow endpoint
router.post('/', (req, res, next) => {
    var currentUserId = req.cookies.userId; //my id
    var targetId;
    var follow = true; //default : true
    if (typeof (req.body.follow) !== 'undefined')
        follow = req.body.follow;

    User.findOne({ username: req.body.username }, function (err, user) {
        //can't find a user by username
        if (err || !user) {
            console.log("Can't find username");
            res.status(200).json({
                status: 'error'
            });
        }
        else {
            targetId = user._id;

            if (follow) //follow
            {
                async.parallel([
                    function (callback) {
                        User.update( //update targetId
                            {
                                _id: targetId,
                                followers: { $ne: currentUserId }
                            },
                            {
                                $push: { followers: currentUserId }
                            }, function (err, count) {
                                callback(err, count);
                            }
                        )
                    },

                    function (callback) { //update currentUser
                        User.update(
                            {
                                _id: currentUserId,
                                following: { $ne: targetId }
                            },
                            {
                                $push: { following: targetId }
                            }, function (err, count) {
                                callback(err, count);
                            }
                        )
                    }
                ], function (err, results) {
                    if (err) {
                        res.status(200).json({
                            status: 'error'
                        });
                    }
                    res.status(200).json({
                        status: 'OK'
                    });
                });
            }
            else //unfollow
            {
                async.parallel([
                    function (callback) {
                        User.update(
                            {
                                _id: targetId,
                            },
                            {
                                $pull: { followers: currentUserId }
                            }, function (err, count) {
                                callback(err, count);
                            }
                        )
                    },

                    function (callback) {
                        User.update(
                            {
                                _id: currentUserId,
                            },
                            {
                                $pull: { following: targetId }
                            }, function (err, count) {
                                callback(err, count);
                            }
                        )
                    }
                ], function (err, results) {
                    if (err) {
                        res.status(200).json({
                            status: 'error'
                        });
                    }
                    res.status(200).json({
                        status: 'OK'
                    });
                });
            }

        }

    });
});

module.exports = router;
