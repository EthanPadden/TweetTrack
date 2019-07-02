var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const { exec } = require('child_process')
// var Tweets = require('../models/weeks')
var Trackers = require('../models/trackers')
var fs = require('fs')
const { fork } = require('child_process')
var killProcessTime = 3000
var idPrintTime = 3000
const {ObjectID} = require('mongodb'); 

router.get('/trackUser', function (req, res, next) {
  // {handle:String}
  var handle = req.query.handle

  var track = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tracker', handle], { detached: true })
  track.unref() // Stops parent from waiting for tracker to exit

  while (true) if (track != null) break // Wait for process to start

  // APPROACH:
  // Java starts tracker
  // JS waits for a short period of time
  // Java prints the tracker id to a file
  // JS reads file
  // JS clears file fs.truncate('/path/to/file', 0, function(){console.log('done')})

  setTimeout(function() {
  	 var pid = track._handle.pid

     fs.readFile('trackerid.txt', function (err, data) {
      var data = `${data}`;
  
      if(data.indexOf('ID') == -1) {
        res.json({'status' : 'error'})
      } else {
        var trackerID = data.split(':')[1];
        // var trackerIDObj = ObjectID(trackerID)
        var idToSch = trackerID.split('\n')[0]
        Trackers.findOne({_id:idToSch}, function (err,tracker) {
            if (err)
                res.send(err);
            else if(tracker) {
                  tracker.pid = pid;
                  tracker.save(function(err, tracker) {
                    if (err)
                        throw err;
                        res.json({'status':'tracker_set'})
                });
            }
        });
      }
     
  })
  
  
  //   res.json({ 'status': 0 })

  
}, idPrintTime)})

router.get('/killTracker', function (req, res, next) {

  Trackers.find({handle:req.query.handle}, function(err, trackers){
    if(err) res.send(err)
    else if(trackers) {
      for(var i in trackers) {
        var pid = trackers[i].pid
        exec('kill -9 ' + parseInt(pid))
      }
        setTimeout(function () {
    res.json({ 'trackers_killed': trackers.length })
  }, killProcessTime)
    } else {
      res.json({'status':'tracker_not_found'})
    }
  })

  

  // fs.readFile('proc.txt', function (err, data) {
  //   var processes = `${data}`.split('\n')
  //   var dataStr = ''
  //   for (var i in processes) {
  //     if (processes[i].indexOf(handle) != -1) {
  //       var pid = processes[i].split(',')[0]
  //       toKill.push(pid)
  //       processes.splice(i, 1)
  //     } else dataStr += processes[i] + '\n'
  //   }

  //   fs.writeFile('proc.txt', dataStr, (err) => {
  //     if (err) console.log(err)
  //     else
  //       for (var i in toKill) {
  //         exec('kill -9 ' + parseInt(toKill[i]))
  //     }
  //   })
  // })

  // setTimeout(function () {
  //   res.json({ 'trackers_killed': toKill.length })
  // }, killProcessTime)

})

router.get('/checkStatus', function (req, res, next) {
  // {handle:String}
  // Steps 1 + 2
  track.send({ cmd: 'status', handle: req.query.handle })

  setTimeout(function () {
    fs.readFile('trackerstatus.txt', function (err, data) {
      if (`${data}`.length == 0 || err) {
        console.log('ERR')
        if (err) console.log(err.msg)
        res.json({ 'status': -1 })
      } else {
        res.json({ 'data': `${data}` })
      }
    })
  }, 6000)
})

process.on('exit', function () {
  if (tracker != null) tracker.send('end')
})

module.exports = router
