var weightInputs = ['wL', 'wR', 'wM', 'wH', 'wO']
var weights = []

var gTweets = {GameOfThrones:null}

$('#calc-w-btn').click(function(){
    for(var i in weightInputs){
        var w = $('#' + weightInputs[i]).val()
        if(isNaN(w) || w.length == 0) alert("Weight must be a number")
        else weights[i] = parseFloat(w)
    }

    if(weights.length == 5) {
        if(gStats.GameOfThrones == null || gStats.GameOfThrones.avg_likes == null ||  gStats.GameOfThrones.avg_rts == null) {
            $.ajax({
                type: 'GET',
                url: '/got/getStats',
                success: function(data) {
                    if (data.status == 0) {
                        gStats.GameOfThrones = data.stats[0]
                        getTweets()
                    } else if(data.status) console.log("Error: status " + data.status);
                    else console.log("Error: no status available");
                },
                error: function(errMsg) {
                    console.log(errMsg);
                }
            });
        } else {
            var engmt = calculateEngagementFromWeights(gStats, weights)
            generateTweetEngmtChart(gStats.GameOfThrones, weights)

            // All tweets are likely to be loaded, because of the high speed of that route (1 DB operation)
            // Check have all tweets the stats cell:
            var tableBody = $('#GOT-table tbody')[0]
            var rows = $(tableBody).children()
            var i = 0
            var lim = rows.length
            for(i = 0; i < lim; i++) {
                if(rows[i].childElementCount < 7) {
                    getTweetStatsToAdd(i)
                } else {
                    var cells = $(rows[i]).children()
                    var stats = JSON.parse($(cells[6]).html())
                    stats.likes = parseInt($(cells[3]).html())
                    stats.rts = parseInt($(cells[4]).html())
                    getTweetEngagementsToAdd(stats, cells)
                }
            }
        }
    }
})

function getTweets() {
    $.ajax({
        type: 'GET',
        url: '/got/getTweets',
        success: function(data) {
            if (data.status == 0) {
                var tweetStats = getStatsFromTweets(data.tweets)
                gStats.GameOfThrones.avg_likes = tweetStats.avg_likes
                gStats.GameOfThrones.avg_rts = tweetStats.avg_rts

                var engmt = calculateEngagementFromWeights(gStats, weights)
                generateTweetEngmtChart(gStats.GameOfThrones, weights)


                for(var i in data.tweets) {
                    addTweetToTable(data.tweets[i])
                }

                // Table has been created at this point
                getTweetStatsToAdd(0)
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function addTweetToTable(tweet) {
    var tableBody = $('#GOT-table tbody')[0]
    var html = '<tr id="' + tweet._id + '"><td>' + tweet.text + '</td>'
    + '<td>Calculating...</td>'
    + '<td class="hidden">' + tweet.tweet_id + '</td>'
    + '<td class="hidden">' + tweet.favourite_count + '</td>'
    + '<td class="hidden">' + tweet.retweet_count + '</td>'
    + '<td class="hidden">' + tweet.timestamp_ms + '</td></tr>'
    $(tableBody).append(html)
}

function getTweetStatsToAdd(i) {
    var tableBody = $('#GOT-table tbody')[0]
    var rows = $(tableBody).children()

    if(i >= rows.length)    return
    else {
        $.ajax({
            type: 'GET',
            url: '/got/tweetEngmt',
            data: {'_id':rows[i].id},
            success: function(data){
                if(data.status == 0) {
                   var cells = $(rows[i]).children()
                    data.stats.likes = parseInt($(cells[3]).html())
                    data.stats.rts = parseInt($(cells[4]).html())
                    var statsToSave = {
                        'before_mentions':data.stats.before_mentions,
                        'after_mentions':data.stats.after_mentions,
                        'before_hashtags':data.stats.before_hashtags,
                        'after_hashtags':data.stats.after_hashtags,
                        'before_other':data.stats.before_other,
                        'after_other':data.stats.after_other
                    }
                    getTweetEngagementsToAdd(data.stats, cells)
                    var html = '<td class="hidden">' + JSON.stringify(statsToSave) + '</td>'
                    $(rows[i]).append(html)
                    getTweetStatsToAdd(++i)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
}

function getTweetEngagementsToAdd(stats, cells) {
    var engmt = calculateTweetEngagement(stats, weights)
    $(cells[1]).html(engmt)
}