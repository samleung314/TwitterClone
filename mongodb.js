var mongoose = require('mongoose');

var mongoDB = 'mongodb://mongo-admin:password@172.31.92.221:27017/twitter';
mongoose.connect(mongoDB);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to Mongoose!");
});