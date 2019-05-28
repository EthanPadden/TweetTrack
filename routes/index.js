var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET overview dashboard */
router.get('/overview', function(req, res, next) {
  res.render('dash_o', { title: 'Overview' });
});

module.exports = router;
