var mongoose = require('mongoose');
const options = {poolSize: 15}
var mongoDB = 'mongodb://mongo-twitter:password@172.31.88.243:27017/twitter';
mongoose.connect(mongoDB, options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to Mongoose!");
});