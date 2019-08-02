var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var hashtagsSchema = new Schema({
    tweet_id: {type: Number},
    handle: {type: String},
    tracker_id: {type: String},
    tweeting_user: {type: String},
    created_at: {type: Number},
    text: {type: String}
  })

module.exports = mongoose.model('Hashtags', hashtagsSchema)