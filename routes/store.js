var express = require('express')
var router = express.Router()
const spawn = require('child_process').spawn
const { exec } = require('child_process')
// var Tweets = require('../models/weeks')
var Trackers = require('../models/trackers')
var Tweets = require('../models/tweets')
var Mentions = require('../models/mentions')
var TweetStats = require('../models/tweetstats')
var fs = require('fs')
const { fork } = require('child_process')
var killProcessTime = 3000
var idPrintTime = 3000
const {ObjectID} = require('mongodb'); 

router.get('/getStats', function (req, res, next) {
    var id = req.query.id

    TweetStats.findOne({tweet_id:id}, function(err, stats){
      if(err) res.send(err)
      else if(stats) {
        if(!stats._id) res.json({'status':2})
        else {
            res.json({'status':0, 'stats':stats})
        }
      }
    })
  })

  module.exports = router