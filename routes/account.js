var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.get('/getBasicInfo', function(req, res ,next){
    exec('java -jar java/TweetTrack.jar ' + req.query.handle, function(err, stdout) {
        if(err) res.send(err);
        else {
            console.log(stdout);
        }
    });
});

module.exports = router;