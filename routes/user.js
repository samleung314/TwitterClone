const express = require('express');
const async = require('async');
const router = express.Router();
const User = require('../model/User');


//Gets user profile information
router.get('/:id', function (req, res, next) {



});

//Gets list of users following “username”
router.get('/:id/followers', function (req, res, next) {



});

//Gets list of users “username” is following
router.get('/:id/following', function (req, res, next) {



});

module.exports = router;
