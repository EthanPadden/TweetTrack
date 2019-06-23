var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var tweetsSchema = new Schema({
  tweet_id: {type: String},
  week: {type: String} // Weeks are identified by start date (Monday)
})

module.exports = mongoose.model('Tweets', tweetsSchema)
