var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;

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
        // Input data: { handle:string, numDays:int}
        const child = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tweetstats', req.query.handle, req.query.numDays]);
        var i = 0;
        

        var outputJSON = {
            'status':-1,
            'tweetStream':[]
        };

        child.stdin.setEncoding('utf-8');
        // Initial
        child.stdin.write('0\n');
        child.stdout.pipe(process.stdout);

        child.stdout.on('data', (data) => {
            outputJSON.status = 0;
            console.log("A - " + data);

                if(data.indexOf('Tweet: ') == 0){ // Output
                    console.log("B");       
                    if(i == 10)res.json(outputJSON);
                    var outputString = `${data}`.split('Tweet: ')[1];
                    child.stdout.once('drain', () => {
                        console.log('The data has been flushed');
                      });
                    if(outputString.indexOf("WAITING_SIGNAL") != -1) {
                        outputString = outputString.split('WAITING_SIGNAL')[0]; }
                    var tweetJSON = JSON.parse(outputString);
                    outputJSON.tweetStream[i] = tweetJSON;
                    i++;

                    console.log("C");                    
                    child.stdin.write('0\n');
                } else if (data.indexOf('WAITING_SIGNAL') == 0) { // Waiting signal
                    console.log("D");
                    child.stdout.once('drain', () => {
                        console.log('The data has been flushed');
                      });

                    child.stdin.write('0\n');
                } 
        });
        
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
        // child.stderr.on('error', function(err) {
        //     res.err('Error: ' + err);
        // });     

        child.on('exit', function(err) {
                console.log("KILL " + i);
        });  
});


module.exports = router;