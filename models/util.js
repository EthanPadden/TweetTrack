var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://mongodb4223pe:vo1pup@danu7.it.nuigalway.ie:8717/mongodb4223', { useNewUrlParser: true });

exports.connection = connection;