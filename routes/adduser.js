var express = require('express');
var router = express.Router();
var User = require('../user/User');

/* GET adduser listing. */
router.get('/', function(req, res, next) {
  res.render('adduser', { title: 'add user' });
});

router.post('/', function(req, res, next) {

  var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var key = makeKey();

	var newUser = new User({
		username: username,
		password: password,
		email: email,
		key: key,
		verified: false
	});

	newUser.save(function (err, newUser) {
		if (err) return console.error(err);
		else console.log("User Saved!");
	});

	res.status(200).json({
		status: 'OK'
	});


});

function makeKey() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

module.exports = router;
