var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.get('/getBasicInfo', function(req, res ,next){
    exec('java -jar java/TweetTrack.jar ' + req.query.handle, function(err, stdout) {
        if(err) res.send(err);
        else {
            if(stdout) {
                var components = stdout.split('{');
                var outputString = '{' + components[components.length-1];
                var outputJSON = JSON.parse(outputString);
                console.log(outputString);
                res.json(outputJSON);
            }
        }
    });
});

module.exports = router;