const {spawn} = require('child_process');
var fs = require('fs')

// NEW APPROACH:
var TwitterStream = require('twitter-stream-api')

var keys = {
    consumer_key : "0dkUzbvy3BTiIIuarFLhnuFA4",
    consumer_secret : "pJfzuLldWM9zxAsiFZa263MwuYUAXLDeb9Rfd1vHd6W6X9Gztt",
    token : "3021951411-EXi896AHCHUuDpi450RvGVoPhfMQkzxbd1H10E1",
    token_secret : "OZCHOyIp1ryVK6GYrCuYxBlz6nlavrQgELkGP3uJxFP5E"
};
 
var Twitter = new TwitterStream(keys, false);
Twitter.stream('statuses/filter', {
    track: '@elonmusk'
});

Twitter.on('data', function (obj) {
    fs.writeFile("mentions.txt", data, (err) => {
        if (err) console.log(err);
    });
});

// Conditions:
// Screen name is not elonmusk
// Not a retweet

// Alternatively: Pipe the data directly and process after
// Twitter.pipe(fs.createWriteStream('tweets.json'));

module.exports.initTracker = initTracker;
