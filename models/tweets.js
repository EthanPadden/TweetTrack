var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var tweetsSchema = new Schema({
    tweet_id: {type: String},
    tracker_id: {type: String},
    text: {type: String},
    created_at: {type: String},
    favourite_count: {type: Number},
    rt_count: {type: Number},
    is_rt: {type: Number},
    handle: {type: String},
    week: {type: String} // Weeks are identified by start date (Monday)
  })

module.exports = mongoose.model('Tweets', tweetsSchema)