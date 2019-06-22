var express = require('express');
// var track = require('./tracker');
var router = express.Router();
const {spawn} = require('child_process');
// const track = fork('routes/tracker.js');
var Tweets = require('../models/weeks');
var fs = require('fs'); 


// track.on('message', (msg) => {
//   console.log('Message from child', msg);
// });


// var fs = require('fs'); 
// var track0;
/*

router.get('/trackUser', function(req, res, next){
    // Input data: { handle:string }
    // var javaCall = 'java -jar java/TweetTrack.jar tracker init ' + req.query.handle;
    var args =  ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', req.query.handle];

    track0 = spawn('java', args);
    if(track0 == null) console.log("ERROR");

    res.json({"Tracker":track0});
    // var sent = false;

    // track0.stdout.on('data', (data) => {
    //    console.log(`${data}`);
    //    if(!sent) {
    //         res.json({"status":0});
    //         sent = true;
    //    }

    // });
      
    // track0.stderr.on('data', (data) => {
    //    console.log(`${data}`);
    // //    res.json({"status":-1});
    // });

    // track0.stdin.setEncoding('utf-8');
   
});

router.get('/trackingStatus', function(req, res, next){
    // // Input data: { handle:string }
    // // var javaCall = 'java -jar java/TweetTrack.jar tracker init ' + req.query.handle;
    // track0.stdin.write('STATUS');
    // track0.stdout.on('data', (data) => {
    //     // res.json({"status":`${data}`});
    //    console.log(`${data}`);

    // });
    res.json({"Tracker":track0});

});
module.exports = router;
*/
router.get('/trackUser', function(req, res, next){
    // track.initTracker(req.query.handle);
    track.send({ cmd: 'init', handle:req.query.handle });
    track.send
});

// if (err)
// res.json({'status': -1});
// else
// res.json({'status': 0, 'tweets':tweets});

// STEP 1
router.get('/getTweetsByWeek', function(req, res, next){
    // Status: 0 - found in DB, 1 - not found in DB, success write to DB, 2 - file read unsuccessful
    var startDate = req.query.start_date;
    var sent = false;
    Tweets.find({week:startDate}, function (err, tweets) {
        if (err || tweets.length == 0){
            console.log("Could not find: " + err);
            // STEP 2

            var args =  ['-jar', 'java/TweetTrack.jar', 'tweetbydate', req.query.handle, req.query.start_date, req.query.end_date, 'dates.txt'];

            var child = spawn('java', args);
            if(child == null) console.log("ERROR: Could not spawn child process");

            child.stdout.on('data', (data) => {
                   console.log(`${data}`);
                   if(!sent) {

                        // STEP 3
                        // For every row read from file - convert to JSON
                        fs.readFile('dates.txt', function(err, data) {
                            if(`${data}`.length == 0) {
                                console.log("Data is empty");
                                res.json({"status":2});
                            } else {
                            var tweetArr = `${data}`.split('\n');
                            var jsonArr = [];
                            for(var i = 0; i < tweetArr.length-1; i++) {
                                jsonArr[i] = JSON.parse(tweetArr[i]);
                            }
// Extract details and add to tweet object (id, start_date) - then save to DB
for(var i in jsonArr) {
    var tweet = new Tweets();
    var status = 0;

    tweet.tweet_id = parseInt(jsonArr[i].id);
    tweet.week = startDate;
    console.log("JSON: " + jsonArr[i].start_date);
    console.log("DB Obj: " + tweet);

    tweet.save(function(err, tweet) {
        if (err){
            success = 3;
        
        }
    });
}

// NOT TESTED

res.json({"status":status});
sent = true;
                        
                            }
                        });
                        
                   }
            
            });
                  
            child.stderr.on('data', (data) => {
                   console.log(`${data}`);
                });
            
        }
            
        else
            res.json({'status': 0, 'tweets':tweets});
    });
   
});


// track.on('message', (msg) => {
//     console.log('Message from child', msg);
//   });

module.exports = router;
