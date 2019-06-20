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
        if(`${data}`.indexOf("INIT_SIGNAL") == 0) console.log("SUCCESS");
    });
      
    track0.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });
        // if(stdout)  {
        //     setTimeout(function () {
        //         if(stdout.indexOf("Tracker initialized") != -1) {
        //             console.log("Success");
        //             res.json({"status":0});
        //         } else {
        //             console.log("Error");
        //             res.json({"status":-1});
        //         }
        //     }, 1000); 
        // } else if (err) {
        //     console.log("Err: " + err);
        // }
});


module.exports = router;
