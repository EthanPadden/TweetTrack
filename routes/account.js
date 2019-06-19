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
    var javaCall = 'java -jar java/TweetTrack.jar tweetstats ' + req.query.handle + ' ' + req.query.count + ' ' + 'java/statuslist.txt';
    exec(javaCall, function(err, stdout) {
        if(stdout)  {
            setTimeout(function () {
                fs.readFile('java/statuslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        console.log("Data is empty");
                        res.json({"status":-1});
                    } else {
                    var tweetArr = `${data}`.split('\n');
                    var jsonArr = [];
                    console.log("LEN: " + tweetArr.length);
                    for(var i = 0; i < tweetArr.length-1; i++) {
                        jsonArr[i] = JSON.parse(tweetArr[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        } else res.json({'status':-1});
    });
});


router.get('/getTweetsByTime', function(req, res, next){
    // Input data: { handle:string, numDays:int}
    var javaCall = 'java -jar java/TweetTrack.jar tweetbytime ' + req.query.handle + ' ' + req.query.numDays + ' ' + 'java/statuslist.txt';
    exec(javaCall, function(err, stdout) {
        if(stdout)  {
            setTimeout(function () {
                fs.readFile('java/statuslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        console.log("Data is empty");
                        res.json({"status":-1});
                    } else {
                    var tweetArr = `${data}`.split('\n');
                    var jsonArr = [];
                    console.log("LEN: " + tweetArr.length);
                    for(var i = 0; i < tweetArr.length-1; i++) {
                        jsonArr[i] = JSON.parse(tweetArr[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        }
    });
});

router.get('/getMentions', function(req, res, next){
    // Input data: { handle:string, span:int, unit:string}
    var javaCall = 'java -jar java/TweetTrack.jar mentions ' + req.query.handle + ' ' + req.query.span + ' ' + req.query.unit + ' ' + 'java/mentionslist.txt';
    exec(javaCall, function(err, stdout) {
        
        if(stdout)  {
        

            setTimeout(function () {
                fs.readFile('java/mentionslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        var msg = "Data is empty";
                        console.log(msg);
                        res.json({"status":-1, "message":msg});
                    } else {
                    var timeSlices = `${data}`.split('\n');
                    
                    var jsonArr = [];
                    console.log("LEN: " + timeSlices.length);
                    console.log(`${data}`);
                    console.log("Error: " + err);

                    for(var i = 0; i < timeSlices.length-1; i++) {
                        jsonArr[i] = JSON.parse(timeSlices[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
        console.log(javaCall);
                    
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        }
    });
});

module.exports = router;