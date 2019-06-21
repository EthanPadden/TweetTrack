var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// require('./util');

var tweetsSchema = new Schema({
    tweet_id: {type:Number},
    week: {type: Date} // Weeks are identified by start date (Monday)
});

module.exports = mongoose.model('Tweets', tweetsSchema);