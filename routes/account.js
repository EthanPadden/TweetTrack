var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;
var fs = require('fs'); 
// var Tweets = require('../models/weeks');


router.get('/getBasicInfo', function(req, res ,next){
   // Input data: { handle:string }
   exec('java -jar java/TweetTrack.jar overview ' + req.query.handle, function(err, stdout) {
    if(err) res.json({"status":-1});
    else {
        if(stdout) {
            var components = stdout.split('{');
            var outputString = '{' + components[components.length-1];
            var outputJSON = JSON.parse(outputString);
            outputJSON.status = 0;
            res.json(outputJSON);
        }
    }
});
    
});

router.get('/getTweetInfo', function(req, res, next){
    // Input data: { handle:string, count:int}
    var javaCall = 'java -jar java/TweetTrack.jar tweetstats ' + req.query.handle + ' ' + req.query.count + ' ' + 'java/statuslist.txt';
    exec(javaCall, function(err, stdout) {
        if(stdout)  {
            setTimeout(function () {
                fs.readFile('java/statuslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        console.log("Data is empty");
                        res.json({"status":-1});
                    } else {
                    var tweetArr = `${data}`.split('\n');
                    var jsonArr = [];
                    console.log("LEN: " + tweetArr.length);
                    for(var i = 0; i < tweetArr.length-1; i++) {
                        jsonArr[i] = JSON.parse(tweetArr[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        } else res.json({'status':-1});
    });
});


router.get('/getTweetsByTime', function(req, res, next){
    // Input data: { handle:string, numDays:int}
    var javaCall = 'java -jar java/TweetTrack.jar tweetbytime ' + req.query.handle + ' ' + req.query.numDays + ' ' + 'java/statuslist.txt';
    exec(javaCall, function(err, stdout) {
        
        if(stdout)  {
            console.log("OUT: " + stdout);
            setTimeout(function () {
                fs.readFile('java/statuslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        console.log("Data is empty");
                        res.json({"status":-1});
                    } else {
                    var tweetArr = `${data}`.split('\n');
                    var jsonArr = [];
                    console.log("LEN: " + tweetArr.length);
                    for(var i = 0; i < tweetArr.length-1; i++) {
                        jsonArr[i] = JSON.parse(tweetArr[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        } else if (err) {
            console.log("ERROR: " + err);
        }
    });
});

router.get('/getMentions', function(req, res, next){
    // Input data: { handle:string, span:int, unit:string}
    var javaCall = 'java -jar java/TweetTrack.jar mentions ' + req.query.handle + ' ' + req.query.span + ' ' + req.query.unit + ' ' + 'java/mentionslist.txt';
    exec(javaCall, function(err, stdout) {
        
        if(stdout)  {
        

            setTimeout(function () {
                fs.readFile('java/mentionslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        var msg = "Data is empty";
                        console.log(msg);
                        res.json({"status":-1, "message":msg});
                    } else {
                    var timeSlices = `${data}`.split('\n');
                    
                    var jsonArr = [];
                    console.log("LEN: " + timeSlices.length);
                    console.log(`${data}`);
                    console.log("Error: " + err);

                    for(var i = 0; i < timeSlices.length-1; i++) {
                        jsonArr[i] = JSON.parse(timeSlices[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
        console.log(javaCall);
                    
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
        }
    });
});

router.get('/getTweetsByWeek', function (req, res, next) {    
    // Input data: { handle:string, start_date:String, end_date:String}


    /*  APPROACH:
        if (information for that handle and week is in the DB (stored by start_date)):
            Extract the information
            Calculate relevant stats
            FUTURE: Java processes contents of tweets here
            Return relevant information as JSON
        else:
            Call Java to request the information from the API - writes to text file
            On completion - read file contents and store in variable
            Write from variables to DB
            Calculate relevant stats from variables
            FUTURE: Java processes contents of tweets here
            Return relevant information as JSON

        STATUSES: 
        0 - information found in DB
        1 - information not found in DB, but retrieved from API successfully
        -1 - information not found in DB, also could not be retrieved from API (Java problem)
        -2 - information not found in DB, retrieved from API, but could not be stored in DB
    */
    var handle = req.query.handle
    var startDate = req.query.start_date
    var sent = false
    Tweets.find({week: startDate, handle: handle}, function (err, tweets) {
      if (err || tweets.length == 0) {
        // else:
        // Call Java to request the information from the API - writes to text file
        var args = ['-jar', 'java/TweetTrack.jar', 'tweetbydate', req.query.handle, req.query.start_date, req.query.end_date, 'temp.txt']
  
        var child = spawn('java', args)
        if (child == null) console.log('ERROR: Could not spawn child process')
  
        child.stdout.on('data', (childData) => {
            // On completion - read file contents and store in variable
            if(`${childData}`.indexOf('SUCCESS') != -1) {
                if (!sent) {
                    fs.readFile('temp.txt', function (err, data) {
                      if (`${data}`.length == 0) {
                        console.log('Data is empty')
                        res.json({'status': -1})
                        sent = true
                      } else {
                        var tweetArr = `${data}`.split('\n')
                        var status = 1

                    // Write from variables to DB
                        // Calculate relevant stats from variables
                        var totalLikes = 0
                        var totalRTs = 0
                        var numTweets = tweetArr.length

                        for (var i in tweetArr) {
                            if(tweetArr[i].length <1) break
                            var tweetJSON = JSON.parse(tweetArr[i])
                          var tweet = new Tweets()

                          tweet.tweet_id = tweetJSON.id
                          tweet.text = tweetJSON.text
                          tweet.created_at = tweetJSON.created_at
                          tweet.favourite_count = tweetJSON.favourite_count
                          tweet.rt_count = tweetJSON.rt_count
                          tweet.is_rt = Number(tweetJSON.is_rt)
                          
                          tweet.week = startDate
                          tweet.handle = handle

                          totalLikes += tweetJSON.favourite_count
                          totalRTs += tweetJSON.rt_count

                          tweet.save(function (err, tweet) {
                            if (err) {
                              status = -2
                            } else if (tweet) {
                              // console.log(tweet)
                            }
                          })
                        }

                        var avgLikes = Math.round(totalLikes/numTweets)
                        var avgRTs = Math.round(totalRTs/numTweets)
          
                        var stats = {
                            'avg_likes':avgLikes,
                            'avg_rts':avgRTs,
                            'tweet_count':numTweets
                        }

                        // FUTURE: Java processes contents of tweets here

                        // Return relevant information as JSON
                        sent = true
                        res.json({'status': status, 'stats': stats})
                      }
                    })
                  }
            }
          
        })
  
        child.stderr.on('data', (data) => {
          console.log('ERR: ' + `${data}`)
        })
      } else {
        // if (information for that handle and week is in the DB (stored by start_date)):
        // Extract the information
        // Calculate relevant stats

        var totalLikes = 0;
        var totalRTs = 0;
        for (var i in tweets) {
            totalLikes += tweets[i].favourite_count;
            totalRTs += tweets[i].rt_count;
        }
        
        var numTweets = tweets.length
        var avgLikes = Math.round(totalLikes/numTweets)
        var avgRTs = Math.round(totalRTs/numTweets)

        var stats = {
            'avg_likes':avgLikes,
            'avg_rts':avgRTs,
            'tweet_count':numTweets
        }
        // FUTURE: Java processes contents of tweets here
        // Return relevant information as JSON
  
        res.json({'status': 0, 'stats':stats})
      }
    })
  })

module.exports = router;