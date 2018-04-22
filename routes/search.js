var express = require('express');
var router = express.Router();

var User = require('../models/UserRemote');
var Item = require('../models/Item');

router.post('/', function (req, res, next) {
    var currentUser = req.cookies.username;

    // 9 search parameters, default values
    var timestamp = Math.floor(Date.now() / 1000);
    var limit = 25;
    var q = '';
    var username = '';
    var following = true;
    var rank = 'interest';
    var parent = '';
    var replies = true;
    var hasMedia = false;

    if (typeof (req.body.timestamp) !== 'undefined') timestamp = req.body.timestamp;
    if (typeof (req.body.limit) !== 'undefined') limit = Number(req.body.limit);
    if (typeof (req.body.q) !== 'undefined') q = req.body.q;
    if (typeof (req.body.username) !== 'undefined') username = req.body.username;
    if (typeof (req.body.following) !== 'undefined') following = req.body.following;
    if (typeof (req.body.rank) !== 'undefined') rank = req.body.rank;
    if (typeof (req.body.parent) !== 'undefined') parent = req.body.parent;
    if (typeof (req.body.replies) !== 'undefined') replies = req.body.replies;
    if (typeof (req.body.hasMedia) !== 'undefined') hasMedia = req.body.hasMedia;

    // check invalid params
    if (time > now || limit > 100 || limit < 0) {
        console.log("invalid search parameters");
        res.status(200).json({
            status: 'error',
            error: 'Invalid search params'
        });
    }

    
});