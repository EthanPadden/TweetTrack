var express = require('express');
var router = express.Router();

/* GET overview dashboard */
router.get('/', function(req, res, next) {
  res.render('dash_o', { title: 'Overview', layout:'layout'});
});

router.get('/tracker', function(req, res, next) {
  res.cookie('handle', req.query.handle)
  res.render('tracker', { title: 'Tracker', layout:'layout_details'});
})

module.exports = router;
