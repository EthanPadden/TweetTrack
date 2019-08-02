var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var statsSchema = new Schema({
    tweet_id: {type: Number},
    created_at: {type: Number},
    test: {type: String},
    favourite_count: {type: Number}.
    rt_count: {type: Number},
    is_rt: {type: Boolean},
    media_entities: {type: Object},
    url_entities: {type: Object}
  })

module.exports = mongoose.model('Mentions', mentionsSchema)