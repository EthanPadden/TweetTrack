var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var separator = '|||';

router.get('/getBasicInfo', function(req, res ,next){
    // Input data: { handle:string }
    exec('java -jar java/TweetTrack.jar overview ' + req.query.handle, function(err, stdout) {
        if(err) res.json({"status":-1});
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

router.get('/getTweetInfo', function(req, res, next){
    // Input data: { handle:string, count:int}
    exec('java -jar java/TweetTrack.jar tweetstats ' + req.query.handle + ' ' + req.query.count, function(err, stdout) {
        if(err) res.json({"status":-1});
        else {
            if(stdout) {
                var components = stdout.split(separator);
                var tweetData = components[components.length-1];
                var tweetJSON = JSON.parse(tweetData);
                tweetJSON.status = 0;
                res.json(tweetJSON);
                // outputJSON.status = 0;
                // res.json(outputJSON);
            }
        }
    });

});

module.exports = router;