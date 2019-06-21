const {spawn} = require('child_process');
var trackerInitialized = false;
var tracker;
// For testing
function proc() {
    console.log("Spawn");
}

process.on('message', (msg) => {
    console.log('Message from parent:', msg.hello);
    process.send({"back":"at you"});
});

function initTracker(handle) {
    console.log("CH attempting to start tracking " + handle + "...");
    var args =  ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', handle];

    tracker = spawn('java', args);

    if(tracker == null) console.log("ERROR");
    else tracker.stdin.setEncoding('utf-8');

    tracker.stdout.on('data', (data) => {
    //    console.log('CHOP: ' + `${data}`);
    });
      
    tracker.stderr.on('data', (data) => {
    //    console.log('CHERR: ' + `${data}`);
    });
}


module.exports.initTracker = initTracker;
