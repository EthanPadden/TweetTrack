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


router.get('/trackUser', function(req, res, next){
    // {handle:String}
    
    track.send({ cmd: 'init', handle:req.query.handle });
    
});

router.get('/checkStatus', function(req, res, next){
    // {handle:String}
    
    track.send({ cmd: 'status', handle:req.query.handle });
    
});

module.exports = router;
