var mongoose = require('mongoose');  
var ItemSchema = new mongoose.Schema({  
  id: String,
  username: String,
  property: {
    likes: Number
  },
  retweeted: Number,
  content: String,
  timestamp: Number,
  childType: {type: String, default: null},
  parent: {type:String, default: ''},
  media: [ String ]
});
mongoose.model('Item', ItemSchema);

module.exports = mongoose.model('Item', ItemSchema);