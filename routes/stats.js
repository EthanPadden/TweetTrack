var express = require('express')
var router = express.Router()
var Tweets = require('../models/tweets')
var Mentions = require('../models/mentions')
var Trackers = require('../models/trackers')

router.post('/getTracker',function(req, res, next){
    // Input: { tracker_id:String }
    Trackers.find({_id:req.query.tracker_id}, function (err,tracker) {
        if (err)
            res.send(err);
        else if(tracker) {
            res.json({"Tracker": {
                'id':tracker.id,
                'h':tracker.handle
            }})
        }
    });
});

module.exports = router