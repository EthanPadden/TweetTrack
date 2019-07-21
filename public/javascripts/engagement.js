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

function calculateEngagementFromWeights(stats, weights, tweets) {
    var counts = getCounts(tweets)
    var avgL = 0
    var avgR = 0

    // FOR NOW: - instead of tweet loop
    var tweetCount = stats.GameOfThrones.tweets
    if(tweetCount > 0) avgR = stats.GameOfThrones.retweets/tweetCount

    if(stats.tweet_count > 0) {
        avgL = counts.likes_count/stats.tweet_count
        // avgR = counts.rt_count/stats.tweet_count
    }   

    engmt = weights[0]*avgL + weights[1]*avgR + weights[2]*stats.GameOfThrones.mentions + weights[3] * stats.GameOfThrones.hashtags + weights[4]*stats.GameOfThrones.other

    return {
        "avg_likes":Math.round(avgL),
        "avg_rts":Math.round(avgR),
        "engagement":Math.round(engmt)
    }
}

function getCounts(tweets) {
    var likes = 0
    var rts = 0
    for(var i in tweets) {
        likes += tweets[i].favourite_count
        rts += tweets[i].retweet_count
    }
    return {'likes_count': likes, 'rt_count':rts}
}