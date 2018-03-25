var mongoose = require('mongoose');  
var ItemSchema = new mongoose.Schema({  
  content: String,
  childType: String,
  user: String
});
mongoose.model('Item', ItemSchema);

module.exports = mongoose.model('Item');