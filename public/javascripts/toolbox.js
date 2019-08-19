function calculateEngagement(stats) {
    console.log(stats)
    /* Input:
    {
        tweet_count: int,
        followers_count: int,
        favourite_count: int,
        retweet_count: int,
        mention_count: int
    } */

    var avgFavourites = 0
    var avgRetweets = 0
    var engmt = stats.mention_count

    if(stats.tweet_count > 0) {
        avgFavourites = stats.favourite_count/stats.tweet_count
        avgRetweets = stats.retweet_count/stats.tweet_count
        engmt = 10*(avgFavourites/stats.followers_count) + 100*(avgRetweets/stats.followers_count) + stats.favourite_count + stats.retweet_count + stats.mention_count
    }   

    var results = {
        "avg_likes":Math.round(avgFavourites),
        "avg_rts":Math.round(avgRetweets),
        "engagement":Math.round(engmt)
    }

    return results;
}

function statusHTML(isTracking) {
    if(isTracking) return '<span class="badge badge-secondary tracking">Tracking</span>'
    else return '<span class="badge badge-secondary not-tracking">Not tracking</span>'
}