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
    var avgL = stats.likes_count/stats.tweet_count
    var avgR = stats.rt_count/stats.tweet_count

    var engmt = 100(avgL/followersCount) + 1000(avgR/followersCount) + stats.mentions_count

    var results = {
        "avg_likes":avgL,
        "avg_rts":avgR,
        "engagement":engmt
    }
}