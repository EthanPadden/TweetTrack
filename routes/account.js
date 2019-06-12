var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
var separator = '|||';

router.get('/getBasicInfo', function(req, res ,next){
    // Input data: { handle:string }
    spawn('java -jar java/TweetTrack.jar overview ' + req.query.handle, function(err, stdout) {
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
    // var child = spawn('java -jar java/TweetTrack.jar tweetstats ' + req.query.handle + ' ' + req.query.count);
    const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tweetstats', req.query.handle, req.query.count]);
    // var child = spawn('ls');

    child.on('exit', function (code, signal, error) {
        console.log(code);
        console.log(signal);
        console.log(error);
        // var components = stdout.split(separator);
        // var tweetData = components[components.length-1];
        // var tweetJSON = JSON.parse(tweetData);
        // tweetJSON.status = 0;
        // res.json(tweetJSON);

    });

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
      });
      
      child.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
      });
      child.on('error', function(err) {
        console.log('Error: ' + err);
      });     
    
});

module.exports = router;