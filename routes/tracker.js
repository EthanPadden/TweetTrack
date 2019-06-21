const {spawn} = require('child_process');
var trackerInitialized = false;
var tracker;
// For testing
function proc() {
    console.log("Spawn");
}

process.on('message', (msg) => {
    // console.log('Message from parent:', msg.hello);
    // process.send({"back":"at you"});
    if(msg.cmd == 'init') {
        var success = initTracker(msg.handle);
        if(success == true) process.send({status:'SUCCESS'});
        else process.send({status:'ERROR'});
    }
});

function initTracker(handle) {
    console.log("CH attempting to start tracking " + handle + "...");
    var args =  ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', handle];

    tracker = spawn('java', args);

    if(tracker == null) {
        console.log("ERROR");
        return false;
    }
    else {
        tracker.stdin.setEncoding('utf-8');
        return true;
    }

    tracker.stdout.on('data', (data) => {
    //    console.log('CHOP: ' + `${data}`);
    });
      
    tracker.stderr.on('data', (data) => {
    //    console.log('CHERR: ' + `${data}`);
    });
}


module.exports.initTracker = initTracker;
