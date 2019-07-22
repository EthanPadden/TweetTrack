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
    'after_other':0
  }

  calculateMentions(stats, range, res, h)
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
        calculateHashtags(stats, range, res, h)
    } else {
      res.json({'status':'mentions_not_found'})
      return null
    }
  })
}
function calculateHashtags(stats, range, res, h) {
  Hashtags.find({handle:h}, function (err, hashtags) {
    if(err) res.send(err)
    else if(hashtags) {
        for(var i in hashtags) {
          var mentionDate = hashtags[i].timestamp_ms
          if(mentionDate >= range.before && mentionDate <= range.tweetDate) stats.before_hashtags++
          if(mentionDate > range.tweetDate && mentionDate <= range.after) stats.after_hashtags++
        }
        calculateOther(stats, range, res, h)
    } else {
      res.json({'status':'hashtags_not_found'})
      return null
    }
  })
}
function calculateOther(stats, range, res, h) {
  Other.find({handle:h}, function (err, others) {
    if(err) res.send(err)
    else if(others) {
        for(var i in others) {
          var mentionDate = others[i].timestamp_ms
          if(mentionDate >= range.before && mentionDate <= range.tweetDate) stats.before_others++
          if(mentionDate > range.tweetDate && mentionDate <= range.after) stats.after_others++
        }

        res.json({'status':0, 'stats':stats})
    } else {
      res.json({'status':'hashtags_not_found'})
      return null
    }
  })
}





module.exports = router
