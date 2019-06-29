var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const { exec } = require('child_process')
var Tweets = require('../models/weeks')
var fs = require('fs')
const { fork } = require('child_process');
var track;
var killProcessTime = 3000;


router.get('/trackUser', function(req, res, next) {
    // {handle:String}
    // Steps 1 + 2
    var handle = req.query.handle
    track = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', handle, 'mentions.txt'], { detached: true, stdio: 'ignore' })
        //  java -jar java/TweetTrack.jar tracker init elonmusk mentions.txt



    track.unref(); // Stops parent from waiting for tracker to exit

    while (true) {
        if (track != null) break
    }
    var pid = track._handle.pid
    fs.appendFile("proc.txt", pid + ',' + handle + '\n', (err) => {
        if (err) console.log(err);
    });

    res.json({ 'tracker': 0 })
        // // Step 6
        // track.on('message', (msg) => {
        //   res.json({'message':msg})
        // });
});

router.get('/killTracker', function(req, res, next) {
    var handle = req.query.handle
    var toKill = []


    fs.readFile('proc.txt', function(err, data) {
        var processes = `${data}`.split('\n')
        var dataStr = ""
        for (var i in processes) {
            if (processes[i].indexOf(handle) != -1) {
                var pid = processes[i].split(',')[0]
                toKill.push(pid)
                processes.splice(i, 1)
            } else dataStr += processes[i] + '\n'
        }

        fs.writeFile("proc.txt", dataStr, (err) => {
            if (err) console.log(err);
            else
                for (var i in toKill) {
                    exec('kill -9 ' + parseInt(toKill[i]))
                }
        });

    })
    setTimeout(function() {
            res.json({ 'trackers_killed': toKill.length })
        }, killProcessTime)
        // i = 0;
        // var killProc = spawn('kill', ['-9', parseInt(toKill[i])], { detached: false, stdio:'ignore' })

    // var args = 'kill -9 ' + parseInt(toKill[0])
    // killProc.on('exit', function (code, signal) {
    //   console.log('child process exited with ' +
    //               `code ${code} and signal ${signal}`);
    // });

    /*
    // TODO - remove the ids from the file

      */
})

router.get('/checkStatus', function(req, res, next) {
    // {handle:String}
    // Steps 1 + 2
    track.send({ cmd: 'status', handle: req.query.handle });

    setTimeout(function() {
        fs.readFile('trackerstatus.txt', function(err, data) {
            if (`${data}`.length == 0 || err) {
                console.log("ERR")
                if (err) console.log(err.msg)
                res.json({ "status": -1 });
            } else {
                res.json({ 'data': `${data}` })
            }
        });
    }, 6000)
});

process.on('exit', function() {
    if (tracker != null) tracker.send('end')
})

module.exports = router;