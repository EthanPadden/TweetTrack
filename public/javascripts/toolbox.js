function calculateEngagement(stats) {
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
        engmt = 10*(avgFavourites/stats.followers_count) + 100*(avgRetweets/stats.followers_count) + stats.mention_count
    }   

    var results = {
        "avg_favourites":Math.round(avgFavourites),
        "avg_retweets":Math.round(avgRetweets),
        "engagement":Math.round(engmt)
    }

    return results;
}

function statusHTML(isTracking) {
    if(isTracking) return '<span class="badge badge-secondary tracking">Tracking</span>'
    else return '<span class="badge badge-secondary not-tracking">Not tracking</span>'
}

function getStoredAccountInfo(trackerId) {
    var tr = $('#' + trackerId)[0]
    var cells = $(tr).children()

    var acctInfo = {
        name:$(cells[0]).html(),
        handle:$(cells[1]).html().split('@')[1],
        tweet_count:parseInt($(cells[2]).html()),
        follower_count:parseInt($(cells[3]).html())
    }

    return acctInfo
}

function createTrackerChart(trackerId, stats) {
    var selector = '#tracker-section #tracker-' + trackerId + ' #engmt-chart'
    var ctx = $(selector)

    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ["Avg Likes","Avg Retweets", "Mentions"],

        datasets: [
            {
            backgroundColor: ['#FFE400', '#FF652F', '#14A76C'],
            data: [(10*stats.avg_favourites), (100*stats.avg_retweets), stats.mention_count]
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Contribution to metric'
        }
        }
    });
}

function calculateTweetEngagement(data) {
    var likes = data.tweet.favourite_count
    var rts = data.tweet.rt_count
    var mentionRatio = data.mentions_stats.after_mentions
    if(data.mentions_stats.before_mentions > 0) mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions*100

    
    var engmt = (wL * likes) + (wR * rts) + (lM * mentionRatio)
    // console.log('likes: ' + likes + ' rts: ' + rts + ' m: ' + mentionRatio)
    return Math.round(engmt)
}