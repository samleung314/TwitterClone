var mongoose = require('mongoose');  
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({  
  username: String,
  email: String,
  password: String,
  key: String,
  verified: false,
  following: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }]
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');