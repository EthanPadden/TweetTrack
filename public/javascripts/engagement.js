function calculateEngagement(tweets, f) {
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