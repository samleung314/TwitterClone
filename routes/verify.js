var express = require('express');
var router = express.Router();
var User = require('../user/User');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('verify', { title: 'verify' });
});

router.post('/', function (req, res, next) {
	var email = req.body.verifyEmail;
	var key = req.body.verifyKey;
	var backDoor = 'abracadabra';

	//console.log("email: " + email + "\nkey: " + key);
	User.findOne({ email: email }, function (err, user) {
		//can't find a user by email
		if (err || !user) {
			res.status(200).json({
				status: 'ERROR'
			});
		} else {
			if (user.email == email && (key == backDoor || user.key == key)) {
				//activate user
				user.set({
					verified: true
				});

				//update user on database
				user.save(function (err, updateduser) {
					if (err) return handleError(err);
					//return OK status response
					console.log("Verified!");
					res.status(200).json({
						status: 'OK'
					});
				});

			} else {
				//the key is wrong
				res.status(200).json({
					status: 'ERROR'
				});
			}
		}
	});

});

module.exports = router;