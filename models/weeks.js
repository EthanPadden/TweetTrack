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

var mentionsSchema = new Schema({
  tweet_id: {type: String},
  handle: {type: String},
  tracker_id: {type: String},
  tweeting_user: {type: String},
  created_at: {type: String},
  text: {type: String}
})
var trackerSchema = new Schema({
  start_date: {type: String},
  end_date: {type: String},
  handle: {type: String}
})

module.exports = mongoose.model('Tweets', tweetsSchema)
module.exports = mongoose.model('Tracker', trackerSchema)
module.exports = mongoose.model('Mentions', mentionsSchema)