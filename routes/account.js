var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;
var fs = require('fs'); 

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
        -1 - information not found in DB, also could not be retrieved from API
    */
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
        // if (information for that handle and week is in the DB (stored by start_date)):
        // Extract the information
        // Calculate relevant stats
        var avgLikes = 0;
        var avgRTs = 0;
        for (var i in tweets) {
            avgLikes += tweets.favourite_count;
            avgRTs += tweets.rt_count;
        }

        avgLikes /= tweets.length;
        avgRTs /= tweets.length;
        
        // FUTURE: Java processes contents of tweets here
        // Return relevant information as JSON
  
        res.json({'status': 0, 'avg_likes':avgLikes, 'avg_rts':avgRTs})
      }
    })
  })

module.exports = router;