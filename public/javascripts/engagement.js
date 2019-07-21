function calculateEngagement(tweets, f) {
    // Recheck so that the engagement is calculated using the avgs not the totals
    var l = 0;
    var r = 0;
    var t = tweets.length;
    for(var i in tweets) {
        l += tweets[i].favourite_count;
        r += tweets[i].rt_count;
    }

    var egmt = (100/(f*t))*((l*100)+(r*1000));
   
    var avgL = l/t;
    var avgR = r/t;

    var results = {
        "avg-likes":avgL,
        "avg-RTs":avgR,
        "engagement":egmt
    }
    
    return results;
}

function calculateEngagementFromStats(stats, followersCount) {
    var avgL = 0
    var avgR = 0
    var engmt = stats.mentions_count

    if(stats.tweet_count > 0) {
        avgL = stats.likes_count/stats.tweet_count
        avgR = stats.rt_count/stats.tweet_count
        engmt = 10*(avgL/followersCount) + 100*(avgR/followersCount) + stats.mentions_count
    }   

    var results = {
        "avg_likes":avgL,
        "avg_rts":avgR,
        "engagement":engmt
    }

    return results;
}

function calculateEngagementFromWeights(stats, weights) {
    // FOR NOW: USING RTS ATTIBUTE INSTEAD OF AVG RTS
    return weights[0]*stats.GameOfThrones.avg_likes + weights[1]*stats.GameOfThrones.retweets + weights[2]*stats.GameOfThrones.mentions + weights[3] * stats.GameOfThrones.hashtags + weights[4]*stats.GameOfThrones.other
}

function getStatsFromTweets(tweets) {
    var avgL = 0
    var avgR = 0
    for(var i in tweets) {
        avgL += tweets[i].favourite_count
        avgR += tweets[i].retweet_count
    }

    if(tweets.length > 0) {
        avgL /= tweets.length
        avgR /= tweets.length
    }
   
    return {'avg_likes': avgL, 'avg_rts':avgR}
}