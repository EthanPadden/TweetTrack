var express = require('express');
var router = express.Router();
const {spawn} = require('child_process');
var fs = require('fs'); 
var track0;

router.get('/trackUser', function(req, res, next){
    // Input data: { handle:string }
    // var javaCall = 'java -jar java/TweetTrack.jar tracker init ' + req.query.handle;
    var args =  ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', req.query.handle];

    track0 = spawn('java', args);
    if(track0 == null) console.log("ERROR");

    track0.stdout.on('data', (data) => {
        if(`${data}`.indexOf("INIT_SIGNAL") == 0) res.json({"status":`${data}`});
    });
      
    track0.stderr.on('data', (data) => {
        res.json({"status":-1});
    });

    track0.stdin.setEncoding('utf-8');

});

router.get('/trackingStatus', function(req, res, next){
    // Input data: { handle:string }
    // var javaCall = 'java -jar java/TweetTrack.jar tracker init ' + req.query.handle;
    track0.stdin.write('status');
    track0.stdout.on('data', (data) => {
        res.json({"status":`${data}`});
    });

});
module.exports = router;
