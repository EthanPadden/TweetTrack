var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
var separator = '|||';

router.get('/getBasicInfo', function(req, res ,next){
    // Input data: { handle:string }
    const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'overview', req.query.handle]);

    child.stdout.on('data', (stdout) => {
        var components = stdout.split('{');
        var outputString = '{' + components[components.length-1];
        var outputJSON = JSON.parse(outputString);
        outputJSON.status = 0;
        res.json(outputJSON);
    });

    child.stderr.on('data', (data) => {
        res.json({"status":-1});
    });
    
    child.on('error', function(err) {
        res.json({"status":-1});
    });     
    
});

router.get('/getTweetInfo', function(req, res, next){
    // Input data: { handle:string, count:int}
    const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tweetstats', req.query.handle, req.query.count]);

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