var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const { exec } = require('child_process')
// var Tweets = require('../models/weeks')
var Trackers = require('../models/trackers')
var Tweets = require('../models/tweets')
var Mentions = require('../models/mentions')
var Stats = require('../models/stats')
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
  // track.stdout.pipe(process.stdout)
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
        else returnStats(tracker._id.toString(), res)
      }
    })
  })

function returnStats(id, res) {
  Stats.findOne({tracker_id:id}, function(err, stats) {
    if(err) res.send(err)
    else if(stats) {
      res.json({'status':0, 'stats':stats})
    }else {
      res.json({'status':'stats_not_found'})
    }
  })
}
router.get('/getTweets', function (req, res, next) {
  Tweets.find({handle:req.query.handle},function(err, tweets){
    if(err) res.send(err)
    else if(tweets) {
      var tweetRes = []
      for(var i in tweets) {
        tweetRes.push({
          'tweet_id':tweets[i].tweet_id,
          'created_at':tweets[i].created_at,
          'text':tweets[i].text,
          'favourite_count':tweets[i].favourite_count,
          'rt_count':tweets[i].rt_count,
          'is_rt':tweets[i].is_rt,
          '_id':tweets[i]._id
        })
      }
      res.json({'status':0, 'tweets':tweetRes})
    } else {
      res.json({'status':'tweets_not_found'})
    }
  })
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

router.get('/runningTrackers', function (req, res, next) {
  Trackers.find(function(err, trackers){
    if(err) res.send(err)
    else if(trackers) {
      trackerInfo = []
      for(var i in trackers) {
        t = {
          'handle':trackers[i].handle,
          'start_date':trackers[i].start_date
        }
        trackerInfo.push(t)
      }
      res.json({'status':0, 'trackers':trackerInfo})
    } else {
      res.json({'status':'tracker_not_found'})
    }
  })
})

process.on('exit', function () {
  if (tracker != null) tracker.send('end')
})

router.get('/trackerData', function (req, res, next) {
  // Input: {handle:String}

  Trackers.findOne({handle:req.query.handle},function(err, tracker){
    if(err) res.send(err)
    else if(tracker) {
        var id = tracker._id.toString()
        getTweets(id, res)
    } else {
      res.json({'status':'tracker_not_found'})
    }
  })
})

router.get('/tweetEngmt', function (req, res, next) {
  Tweets.findOne({_id:req.query._id},function(err, tweet){
    if(err) res.send(err)
    else if(tweet) {
      // res.json({'status':0, 'tweet':tweet})
      var stats =[]
      var range = {
        'before':tweet.timestamp_ms - 10800000,
        'tweetDate':tweet.timestamp_ms,
        'after':tweet.timestamp_ms + 10800000
      }
      calculateTimeStats(stats, range, res, 'GameOfThrones', 0)
    } else {
      res.json({'status':'tweet_not_found'})
    }
  })
})


function calculateTimeStats(stats, range, res, h, i) {
  if(i >= 6) {
    var resStats = {
      'before_mentions':stats[0],
      'after_mentions':stats[1],
      'before_hashtags':stats[2],
      'after_hashtags':stats[3],
      'before_other':stats[4],
      'after_other':stats[5]
    }
    res.json({'status':0, 'stats':resStats})
  } else {
    var start, finish
    var Collection
    if(i%2 == 0) {
      var x = i/2
      Collection = collections[x]
      start = range.before
      finish = range.tweetDate
      
      console.log("i = " + i + "\tDB[" + x + "]\t" + "s:bef" + "\tf:t")
    } else {
      var x = (i-1)/2
      Collection = collections[x]
      start = range.tweetDate
      finish = range.after
      console.log("i = " + i + "\tDB[" + x + "]\t" + "s:t" + "\tf:aft")

    }
    
    Collection.find({handle:h}).where('timestamp_ms').gt(start).lt(finish).exec(function (err, tweets) {
      if(err) res.send(err)
      else if(tweets) {
        console.log(tweets.length + " found")
        stats[i] = tweets.length
        calculateTimeStats(stats, range, res, h, ++i)
      } else {
        res.json({'err_at':i})
        return null
      }
    })
  }
}

// function getTweets(id, res) {
//   Tweets.find({tracker_id:id},function(err, tweets){
//     if(err) res.send(err)
//     else if(tweets) {
//       stats = {
//         'tweetEngmtMetrics':null
//       }
//       calculateMentionStats(id, res, tweets, 0, stats)

//     } else {
//       res.json({'status':'tweets_not_found'})
//     }
//   })
// }

function calculateMentionStats(h, res, tweet) {
  // Get created at
  var createdAt = tweet.created_at

  // Get mentions 3 hrs before
  // Get mentions 3 hrs after
  var gmtStr = toGmtStr(createdAt)
  var range = calculateRangeDates(gmtStr)

//  { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') }
  
    var beforeMentions = 0
    var afterMentions = 0

  Mentions.find({handle:h}, function (err, mentions) {
    if(err) res.send(err)
    else if(mentions) {
        for(var i in mentions) {
          var gmtMentionDate = toGmtStr(mentions[i].created_at)
          var mentionDate = new Date(gmtMentionDate)
          if(mentionDate >= range.before && mentionDate <= range.tweetDate) beforeMentions++
          if(mentionDate > range.tweetDate && mentionDate <= range.after) afterMentions++
          returnData = {
            'before_mentions':beforeMentions,
            'after_mentions':afterMentions
          }
        }
        res.json({'status':0, 'tweet':tweet, 'mentions_stats': returnData})

    } else {
      res.json({'status':'mentions_not_found'})
      return null
    }
  })


  // Construct Metric obj and append to stats obj
  // Mentions.find({handle:req.query.handle},function(err, tracker){
  //   if(err) res.send(err)
  //   else if(tracker) {
  //       var id = tracker._id.toString()
  //       getTweets(id, res)
  //   } else {
  //     res.json({'status':'tracker_not_found'})
  //   }
  // })
    
  
  
}

// var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ]

function toGmtStr(dateStr) {
  // Does not matter if GMT or IST - just calculating before and after
  // Thu Jul 11 00:27:16 IST 2019
  // 04 Dec 1995 00:12:00 GMT
  var parts = dateStr.split(' ')

  var d = parts[2] // Always has a 0 before single digit

  // var m = months.indexOf(parts[1])
  // var mStr = ("0" + m).slice(-2);
  var m = parts[1]

  var y = parts[5]

  var t = parts[3]
  // var tParts = t.split(':')
  // var h = tParts[0]
  // var min = tParts[1]
  // var s = tParts[2]
  var gmtStr = d + ' ' + m + ' ' + y + ' ' + t + ' GMT'

  // console.log(y + ' ' + m + ' ' + d + ' ' + h + ' ' + min + ' ' + s)
  // var date = new Date(y,m,d,h,min,s)
  // date.setUTCDate(d)
  // date.setUTCHours(h)
  // var isoFormat = y + '-' + mStr + '-' + dStr + 'T' + t
  return gmtStr
}

function calculateRangeDates(tweetDateStr) {
  var tweetDate = new Date(tweetDateStr)
  var before = new Date(tweetDateStr)
  before.setHours(tweetDate.getHours()-3)
  var after = new Date(tweetDateStr)
  after.setHours(tweetDate.getHours()+3)

  return {
    'tweetDate':tweetDate,
    'before':before,
    'after':after
  }
}

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.split('-');
  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

module.exports = router
