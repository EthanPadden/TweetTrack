var express = require('express');
// var track = require('./tracker');
var router = express.Router();
const {fork} = require('child_process');
// const track = fork('routes/tracker.js');
var Tweets = require('../models/weeks');

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
    var startDate = new Date(req.query.start_date);
    
    Tweets.find({week:startDate}, function (err, tweets) {
        if (err)
            res.json({'status': -1});
        else
            res.json({'status': 0, 'tweets':tweets});
    });
   
});


// track.on('message', (msg) => {
//     console.log('Message from child', msg);
//   });

module.exports = router;
