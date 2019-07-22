var express = require('express')
var router = express.Router()

var Tweets = require('../models/got_tweets')
var Mentions = require('../models/got_mentions')
var Users = require('../models/got_users')
var Hashtags = require('../models/got_hashtags')
var None = require('../models/got_none')
var Other = require('../models/got_other')
var Stats = require('../models/got_stats')
var Retweets = require('../models/got_retweets')

router.get('/getTweets', function (req, res, next) {
  Tweets.find({}, function (err, tweets) {
    if (err) res.send(err)
    else if (tweets) {
      res.json({'status': 0, 'tweets': tweets})
    } else {
      res.json({'status': 1})
    }
  })
})

router.get('/getStats', function (req, res, next) {
    Stats.find({handle:'GameOfThrones'}, function (err, stats) {
      if (err) res.send(err)
      else if (stats) {
        res.json({'status': 0, 'stats': stats})
      } else {
        res.json({'status': 1})
      }
    })
  })

  router.get('/tweetEngmt', function (req, res, next) {
    Tweets.findOne({_id:req.query._id},function(err, tweet){
      if(err) res.send(err)
      else if(tweet) {
        // res.json({'status':0, 'tweet':tweet})
        calculateStats(tweet.handle, res, tweet)
      } else {
        res.json({'status':'tweet_not_found'})
      }
    })
  })


  
function calculateEngmtStats(h, res, tweet) {
  var range = {
    'before':tweet.timestamp_ms - 10800000,
    'tweetDate':tweet.timestamp_ms,
    'after':tweet.timestamp_ms + 10800000 
  }
  
  var stats = {
    'before_mentions':0,
    'after_mentions':0,
    'before_hashtags':0,
    'after_hashtags':0,
    'before_other':0,
    'after_other':0,
    'retweets':0
  }

  calculateMentions(stats, range, res, h)
// //  { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') }
}

function calculateMentions(stats, range, res, h) {
  Mentions.find({handle:h}, function (err, mentions) {
    if(err) res.send(err)
    else if(mentions) {
        for(var i in mentions) {
          var mentionDate = mentions[i].timestamp_ms
          if(mentionDate >= range.before && mentionDate <= range.tweetDate) stats.before_mentions++
          if(mentionDate > range.tweetDate && mentionDate <= range.after) stats.after_mentions++
        }
    } else {
      res.json({'status':'mentions_not_found'})
      return null
    }
  })
}





module.exports = router
