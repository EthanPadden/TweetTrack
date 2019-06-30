var mongoose = require('mongoose')
var Schema = mongoose.Schema
require('./util')

var trackerSchema = new Schema({
    start_date: {type: String},
    end_date: {type: String},
    handle: {type: String}
  })

module.exports = mongoose.model('Trackers', trackerSchema)