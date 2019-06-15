var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;
var fs = require('fs'); 

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
    var outputJSON = {
        'status':-1,
        'tweetStream':[]
    };

    exec('java -jar java/TweetTrack.jar tweetstats ' + req.query.handle + ' ' + req.query.count, function(err, stdout) {
        if(err) res.json({"status":-1});
        else {
            if(stdout) {
                console.log(stdout);
            }
        }
    })
  

   
    
});

router.get('/getTweetsByTime', function(req, res, next){
        // Input data: { handle:string, numDays:int}
        const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tweetstats', req.query.handle, req.query.numDays]);
        var i = 0;
        

});


module.exports = router;