var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Clone index' });
});
*/
router.get('/', (req, res, next) => {
  if (req.cookies) {

    res.render('main/home', { title: 'timeline' });
  } else {
    res.render('main/landing');
  }


});

module.exports = router;
