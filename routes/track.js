var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const { exec } = require('child_process')
// var Tweets = require('../models/weeks')
var Trackers = require('../models/trackers')
var Tweets = require('../models/tweets')
var Mentions = require('../models/mentions')
var fs = require('fs')
const { fork } = require('child_process')
var killProcessTime = 3000
var idPrintTime = 3000
const {ObjectID} = require('mongodb'); 

router.get('/trackUser', function (req, res, next) {
  // {handle:String}
  var handle = req.query.handle

  var track = spawn('java', ['-jar', 'java/TweetTrack.jar', 'tracker', handle], { detached: true, stdio: ['pipe','pipe','pipe'] })
  track.unref() // Stops parent from waiting for tracker to exit

  console.log('1 - ' + (track == null))
  while (true) if (track != null) break // Wait for process to start
  track.stdout.pipe(process.stdout)
  console.log('2 - ' + (track == null))
  

  // console.log(track)
  // APPROACH:
  // Java starts tracker
  // JS waits for a short period of time
  // Java prints the tracker id to a file
  // JS reads file
  // JS clears file fs.truncate('/path/to/file', 0, function(){console.log('done')})

  setTimeout(function() {
  console.log('3 - ' + (track == null))

    // console.log(track)
  	 var pid = track.pid

     fs.readFile('trackerid.txt', function (err, data) {
      var data = `${data}`;
        console.log('A')
      if(data.indexOf('ID') == -1) {
        res.json({'status' : 'error'})
      } else {
        console.log('B')

        var trackerID = data.split(':')[1];
        // var trackerIDObj = ObjectID(trackerID)
        var idToSch = trackerID.split('\n')[0]
        Trackers.findOne({_id:idToSch}, function (err,tracker) {
        console.log('C')

            if (err)
                res.send(err);
            else if(tracker) {
              console.log('D')
                  tracker.pid = pid;
                  tracker.save(function(err, tracker) {
                    if (err)
                        throw err;
                    console.log('E')
                        res.json({'status':0})
                });
            } else {
              console.log('err')
            }
        });
      }
     
  })
  
  
  //   res.json({ 'status': 0 })

  
}, idPrintTime)})

router.get('/killTracker', function (req, res, next) {
  console.log("Request to kill trackers for " + req.query.handle)
  Trackers.find({handle:req.query.handle}, function(err, trackers){
    if(err) res.send(err)
    else if(trackers) {
      for(var i in trackers) {
        var pid = trackers[i].pid
        exec('kill -9 ' + parseInt(pid))
      }
        setTimeout(function () {
          var allOk = true
          for(var i in trackers) {
            Trackers.deleteMany({_id:trackers[i]._id}, function(err, trackers){
              if(err)
                  allOk = false
          });

          }
          if(allOk) 
            res.json({ 'trackers_killed': trackers.length })
          else res.json({'status':'error_db_remove'})
        }, killProcessTime)
    } else {
      res.json({'status':'tracker_not_found'})
    }
  })

})
  router.get('/getStats', function (req, res, next) {
    // Currently based on the assumption that there will only be one tracker per handle
    /** APPROACH:
     * Check if there is a tracker running for a particular user
     * If there isnt, respond with the last stats gathered and a status 1
     * If there is, respond with the current stats and a status 0
     */

    console.log("Request to get stats from tracker for " + req.query.handle)
    Trackers.findOne({handle:req.query.handle}, function(err, tracker){
      if(err) res.send(err)
      else if(tracker) {
        if(!tracker._id) res.json({'status':2})
        calculateStats(String(tracker._id), res, null, 0)
      }
    })
  })

  function calculateStats(id, res, stats, sch) {
    console.log('Gathering statistics...' + id)

    if(sch == 0) {
      Tweets.find({tracker_id:id}, function(err, tweets){
        if(err) res.send(err)
        else {
          var likesCount = 0
          var rtCount = 0
          for(var i in tweets) {
            likesCount += tweets[i].favourite_count
            rtCount += tweets[i].rt_count
          }
  
          stats = {
            'tweet_count':tweets.length,
            'likes_count':likesCount,
            'rt_count':rtCount
          }
        
          calculateStats(id, res, stats, 1)
        } 
      })
    } if (sch == 1) {
      Mentions.find({tracker_id:id}, function(err, mentions){
        if(err) res.send(err)
        else {
          stats.mentions_count = mentions.length
          res.json({'status':0, 'stats':stats})
        } 
      })
    }
    
  }


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
