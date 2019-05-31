var express = require('express');
var router = express.Router();

router.get('/getBasicInfo', function(req, res ,next){
    console.log(req.query.handle);
});

module.exports = router;