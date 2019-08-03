var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var statsSchema = new Schema({
    last_updated: {type: String},
    handle: {type: String},
    tracker_id: {type: String},
    likes_count: {type: Number},
    rt_count: {type: Number},
    mentions_count: {type: Number},
    tweet_count: {type: Number}
  })

module.exports = mongoose.model('Stats', statsSchema)