function calculateEngagement(stats) {
    /* Input:
    {
        tweet_count: int,
        followers_count: int,
        favourite_count: int,
        retweet_count: int,
        mention_count: int
    } */

    var avgL = 0
    var avgR = 0
    var engmt = stats.mention_count

    if(stats.tweet_count > 0) {
        avgL = stats.favourite_count/stats.tweet_count
        avgR = stats.retweet_count/stats.tweet_count
        engmt = 10*(avgL/stats.followers_count) + 100*(avgR/stats.followers_count) + stats.mentions_count
    }   

    var results = {
        "avg_likes":avgL,
        "avg_rts":avgR,
        "engagement":engmt
    }

    return results;
}