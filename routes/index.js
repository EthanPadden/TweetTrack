var express = require('express');
var router = express.Router();

/* GET overview dashboard */
router.get('/', function(req, res, next) {
  res.render('dash_o', { title: 'Overview' });
});

module.exports = router;
