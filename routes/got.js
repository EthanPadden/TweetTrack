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

  
    Tweets.find({},function(err, tweets){
      if(err) res.send(err)
      else if(tweets) {
          res.json({'status':0, 'tweets':tweets})
      } else {
        res.json({'status':1})
      }
    })
  })

module.exports = router