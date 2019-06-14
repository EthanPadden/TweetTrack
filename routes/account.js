var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const { exec } = require('child_process');
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
    var limit = req.query.count;
    var i = 0;

    var outputJSON = {
        'status':-1,
        'tweetStream':[]
    };

    // TRY ALL COMBINATIONS AGAIN
    // Ask for intitial tweet
    // process.stdin.pipe(child.stdin);
    // console.log('0');
    // if(i <= limit) {
    //     child.stdin.setEncoding('utf-8');

    //     // Try console.log("0"); instead of 0 if doesnt work
    //     // child.stdin.write("0");
    //     child.stdin.write('console.log("0");');
    //     // console.log('0\n');
    // }

    child.stdout.on('data', (data) => {
        outputJSON.status = 0;

        if(data.indexOf('Tweet: ') == 0){ // Output
            var outputString = `${data}`.split('Tweet: ')[1];
            var tweetJSON = JSON.parse(outputString);
            outputJSON.tweetStream[i] = tweetJSON;
            console.log(JSON.stringify(tweetJSON) + '   ' + i);
            i++;
        } else if (data.indexOf('WAITING_SIGNAL') == 0) { // Waiting signal
            // Waiting for input
        } 

        if(i == limit) {
            res.json(outputJSON);
            child.kill('SIGINT');
            console.log("Killed");
        }
    });
      
  
      child.on('error', function(err) {
        res.json('Error: ' + err);
      });     

    
});

module.exports = router;