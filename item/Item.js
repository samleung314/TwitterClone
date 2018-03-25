var mongoose = require('mongoose');  
var ItemSchema = new mongoose.Schema({  
  content: String,
  childType: String,
  user: String,
  timestamp: Number
});
mongoose.model('Item', ItemSchema);

module.exports = mongoose.model('Item');