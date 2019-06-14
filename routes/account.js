var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;
var separator = '|||';

router.get('/getBasicInfo', function(req, res ,next){
    // Input data: { handle:string }
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
    const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tweetstats', req.query.handle, req.query.count]);
    var limit = req.query.count;
    var i = 0;

    var outputJSON = {
        'status':-1,
        'tweetStream':[]
    };

    child.stdin.setEncoding('utf-8');

    child.stdout.on('data', (data) => {
        outputJSON.status = 0;

        if(i < limit) {
            if(data.indexOf('Tweet: ') == 0){ // Output
                var outputString = `${data}`.split('Tweet: ')[1];
                var tweetJSON = JSON.parse(outputString);
                outputJSON.tweetStream[i] = tweetJSON;
                i++;
                child.stdin.write('0\n');
            } else if (data.indexOf('WAITING_SIGNAL') == 0) { // Waiting signal
                child.stdin.write('0\n');
            } 
        } else {
            child.kill();
        }
        

        
    });
      
  
      child.on('error', function(err) {
        res.err('Error: ' + err);
      });     

      child.on('exit', function(err) {
            res.json(outputJSON);
          
      });     
    
});

router.get('/getTweetsByTime', function(req, res, next){
    console.log("Call");
    // Input data: { handle:string, days:int}
    exec('java -jar java/TweetTrack.jar tweetbytime ' + req.query.handle + ' ' + req.query.days, function(err, stdout) {
        if(err) {
            console.log(err);
            res.json({"status":-1});
        }
        else {
            if(stdout) {
                var components = stdout.split(separator);
                var tweetData = components[components.length-1];
                var tweetJSON = JSON.parse(tweetData);
                tweetJSON.status = 0;
                res.json(tweetJSON);
            }
        }
    });

});


module.exports = router;