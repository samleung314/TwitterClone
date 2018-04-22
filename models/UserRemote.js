var mongoose = require('mongoose');  
const Schema = mongoose.Schema;
var userConn = mongoose.createConnection('mongodb://130.245.168.150:27017/twitter');

var UserSchema = new mongoose.Schema({  
  username: String,
  email: String,
  password: String,
  key: String,
  verified: false,
  following: [ String ],
  followers: [ String ]
});
var user = userConn.model('User', UserSchema);

module.exports = user;