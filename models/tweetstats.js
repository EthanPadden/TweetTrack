var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var statsSchema = new Schema({
    tweet_id: {type: Number},
    created_at: {type: Number},
    text: {type: String},
    favourite_count: {type: Number},
    rt_count: {type: Number},
    is_rt: {type: Boolean},
    media_entities: {type: Object},
    url_entities: {type: Object},
    stats: {type:Object}
  })

module.exports = mongoose.model('TweetStats', statsSchema)