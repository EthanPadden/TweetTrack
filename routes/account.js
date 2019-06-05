var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.get('/getBasicInfo', function(req, res ,next){
    exec('java -jar java/TweetTrack.jar overview ' + req.query.handle, function(err, stdout) {
        if(err) {
            res.json({"status":-1});
        }
        else {
            if(stdout) {
                var components = stdout.split('{');
                var outputString = '{' + components[components.length-1];
                var outputJSON = JSON.parse(outputString);
                outputJSON.status = 0;
                res.json(outputJSON);
            }
        }
    });
});

module.exports = router;