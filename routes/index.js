var express = require('express');
var router = express.Router();

/* GET overview dashboard */
router.get('/', function(req, res, next) {
  res.render('dash_o', { title: 'Overview' });
});

router.get('/tracker', function(req, res, next) {
  res.render('tracker', { title: 'Tracker' });
})

module.exports = router;
