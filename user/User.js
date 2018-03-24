var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  username: String,
  email: String,
  password: String,
  key: String,
  verified: false,
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');