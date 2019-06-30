var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var mentionsSchema = new Schema({
    tweet_id: {type: String},
    handle: {type: String},
    tracker_id: {type: String},
    tweeting_user: {type: String},
    created_at: {type: String},
    text: {type: String}
  })

module.exports = mongoose.model('Mentions', mentionsSchema)