var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var got_mentionsSchema = new Schema({
  tweet_id : {type: Number},
  timestamp_ms : {type: String},
  text : {type: String},
  user_id : {type: Number},
  quote_count : {type: Number},
  reply_count : {type: Number},
  retweet_count : {type: Number},
  favourite_count : {type: Number},
  i : {type: Number}
})

module.exports = mongoose.model('got_mentions', got_mentionsSchema)