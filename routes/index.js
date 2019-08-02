var express = require('express');
var router = express.Router();

/* GET overview dashboard */
router.get('/', function(req, res, next) {
  res.render('dash_o', { title: 'Overview' });
});

router.get('/tracker', function(req, res, next) {
  res.cookie('handle', req.query.handle)
  res.render('tracker', { title: 'Tracker'});
})

router.get('/analysis', function(req, res, next) {
  res.cookie('handle', req.query.handle)
  res.render('analysis', { title: 'Analysis', layout:'layout1'});
})

module.exports = router;
