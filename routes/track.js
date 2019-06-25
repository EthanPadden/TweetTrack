var express = require('express')
var router = express.Router()
const {spawn} = require('child_process')
const {exec} = require('child_process')
var Tweets = require('../models/weeks')
var fs = require('fs')
const {fork} = require('child_process');
const track = fork('routes/tracker.js');

track.on('message', (msg) => {
  console.log('Message from child', msg);
});


// STEP 1
router.get('/getTweetsByWeek', function (req, res, next) {
  console.log('CALL: ' + req.query.start_date)
  // Status: 0 - found in DB, 1 - not found in DB, success write to DB, 2 - file read unsuccessful
  var handle = req.query.handle
  var startDate = req.query.start_date
  var sent = false
  Tweets.find({week: startDate, handle: handle}, function (err, tweets) {
    if (err || tweets.length == 0) {
      console.log('Could not find: ' + err)
      // STEP 2

      var args = ['-jar', 'java/TweetTrack.jar', 'tweetbydate', req.query.handle, req.query.start_date, req.query.end_date, 'dates.txt']

      var child = spawn('java', args)
      if (child == null) console.log('ERROR: Could not spawn child process')

      child.stdout.on('data', (data) => {
        console.log('OUT: ' + `${data}`)
        if (!sent) {

          // STEP 3
          // For every row read from file - save to DB
          fs.readFile('dates.txt', function (err, data) {
            if (`${data}`.length == 0) {
              console.log('Data is empty')
              res.json({'status': 2})
              sent = true
            } else {
              var tweetArr = `${data}`.split('\n')
              // console.log(tweetArr)
              var status = 0
              var output = []

              // CONVERT STRING TO INT CHECK DB FOR INT OR STRING STORAGE

              // Extract details and add to tweet object (id, start_date) - then save to DB
              for (var i in tweetArr) {
                var tweet = new Tweets()
                tweet.tweet_id = tweetArr[i]
                tweet.week = startDate
                tweet.handle = handle
                output[i] = tweetArr[i]
                tweet.save(function (err, tweet) {
                  if (err) {
                    status = 3
                  } else if (tweet) {
                    // console.log(tweet)
                  }
                })
              }

              // Get the tweet stats for these ids
              var stats
              var javaCall = 'java -jar java/TweetTrack.jar tweetbyid dates.txt'
              console.log("ABOUT TO CALL")
              exec(javaCall, function (err, stdout) {
                console.log("CALL")
                if (stdout.indexOf('SUCCESS') == 0) {

                console.log(stdout)

                  var statsJSON = JSON.parse('{' + stdout.split('{'))
                  
                } else if(err){
              console.log(err)
                  
                  status = 4
                  stats = {'Error': 'Failed to get information for IDs'}
                }
              })
              // NOT TESTED
              sent = true

              res.json({'status': status, 'tweets': stats})
            }
          })
        }
      })

      child.stderr.on('data', (data) => {
        console.log('ERR: ' + `${data}`)
      })
    } else {
      var output = []
      for (var i in tweets) output[i] = tweets[i].tweet_id

      res.json({'status': 0, 'tweets': output})
    }
  })
})

router.get('/trackUser', function(req, res, next){
    // {handle:String}
    
    track.send({ cmd: 'init', handle:req.query.handle });
    
});

router.get('/checkStatus', function(req, res, next){
    // {handle:String}
    
    track.send({ cmd: 'status', handle:req.query.handle });
    
});

module.exports = router;
