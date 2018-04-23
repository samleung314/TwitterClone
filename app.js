var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('handlebars');
var async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const config = require('./config/secret');
const bodyParser = require('body-parser');


var Memcached = require('memcached');
Memcached.config.poolSize = 25;
var memcached = new Memcached('localhost:11211', {retries:10});


//create express app
var app = express();

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));
app.use(logger('dev'));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //tells the system that you want json to be used.

// setup routes
var mediaRouter = require('./routes/media');
app.use(mediaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// start server
app.listen(80, () => console.log('Media Server listening on port 80!'))

module.exports = app;
