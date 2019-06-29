var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const {exec} = require('child_process')
var Tweets = require('../models/weeks')
var fs = require('fs')
const {fork} = require('child_process');
var track;



router.get('/trackUser', function(req, res, next){
    // {handle:String}
    // Steps 1 + 2
      track = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tracker', 'init', 'elonmusk', 'mentions.txt'], { detached: true, stdio:'ignore' })
//  java -jar java/TweetTrack.jar tracker init elonmusk mentions.txt

      

      track.unref(); // Stops parent from waiting for tracker to exit
     
      while(true) {
        if (track != null) break
      }
      var pid = track._handle.pid
      fs.appendFile("proc.txt", pid, (err) => {
        if (err) console.log(err);
      });
      
      res.json({'tracker':0})
    // // Step 6
    // track.on('message', (msg) => {
    //   res.json({'message':msg})
    // });
});
var killedProcesses;
var status;
router.get('/killTracker', function(req, res, next) {
  exec('ps -x', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
  
    var processes = `${stdout}`.split('\n')

    var procToKill = []
    for(var i in processes) if(processes[i].indexOf('java') != -1 && processes[i].indexOf(req.query.handle) != -1) procToKill.push(processes[i])
    
    
    if(procToKill.length > 0) {
      var PIDs = []
      for(var i in procToKill) PIDs.push(procToKill[i].split(' ')[0])

      // GETTING HERE
      console.log("PID: " + PIDs)

      status = 1;

      killedProcesses = []
      killProcesses(PIDs, 0)

      // STATUS:
      // 0 - success
      // -2 - failure
      // 1 - running

      while(status = 1){}

      if(status == 0) res.json({'status':status, 'killed_processes':killedProcesses}) 
      else if(status == -2) res.json({'status':status})
      else console.log('status: ' + status)

    } else {
      console.log("No processes found")
      res.json({'status':-1})
    }
  });
})

function killProcesses(PIDs, i) {
  if(i >= killProcesses.length) {
    status = 0
    return
  } else {
    exec('kill -9 ' + PIDs[i], function (err, stdout) {
      console.log("Call")
      if(err || stdout) {
        status = -2
        return
      } else {
        killedProcesses.push(PIDs[i])
        killProcesses(PIDs, i+1)
      }
    })
  }
  
}

router.get('/checkStatus', function(req, res, next){
    // {handle:String}
    // Steps 1 + 2
    track.send({ cmd: 'status', handle:req.query.handle });

    setTimeout(function() {
      fs.readFile('trackerstatus.txt', function(err, data) {
        if(`${data}`.length == 0 || err) {
            console.log("ERR")
            if(err) console.log(err.msg)
            res.json({"status":-1});
        } else {
          res.json({'data': `${data}`})
        }
    });
    }, 6000)
});

process.on('exit', function() {
  if(tracker != null) tracker.send('end')
})

module.exports = router;
