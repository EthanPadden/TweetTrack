var weightInputs = ['wL', 'wR', 'wM', 'wH', 'wO']
var weights = []

var gTweets = {GameOfThrones:null}

$('#calc-w-btn').click(function(){
    for(var i in weightInputs){
        var w = $('#' + weightInputs[i]).val()
        if(isNaN(w) || w.length == 0) alert("Weight must be a number")
        else weights.push(parseFloat(w))
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
        }
    }
})

function getTweets() {
    $.ajax({
        type: 'GET',
        url: '/got/getTweets',
        success: function(data) {
            if (data.status == 0) {
                // var tweetStats = getStatsFromTweets(data.tweets)
                // gStats.GameOfThrones.avg_likes = tweetStats.avg_likes
                // gStats.GameOfThrones.avg_rts = tweetStats.avg_rts

                // var engmt = calculateEngagementFromWeights(gStats, weights)
                // generateTweetEngmtChart(gStats.GameOfThrones, weights)

                // gTweets.GameOfThrones = data.tweets
                // gTweets.GameOfThrones.stats = []
                // getIndividualTweetEngmts(0)

                for(var i in data.tweets) {
                    addTweetToTable(data.tweets[i])
                }
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
    var html = '<tr><td>' + tweet.text + '</td>'
    + '<td>Calculating...</td>'
    + '<td class="hidden">' + tweet._id + '</td>'
    + '<td class="hidden">' + tweet.tweet_id + '</td>'
    + '<td class="hidden">' + tweet.favourite_count + '</td>'
    + '<td class="hidden">' + tweet.retweet_count + '</td>'
    + '<td class="hidden">' + tweet.timestamp_ms + '</td></tr>'
    $(tableBody).append(html)
}

function getIndividualTweetEngmts(i) {
    if(i >= gTweets.GameOfThrones.length) console.log(gTweets)
    else {
        $.ajax({
            type: 'GET',
            url: '/got/tweetEngmt',
            data: {'_id':gTweets.GameOfThrones[i]._id},
            success: function(data){
                if(data.status == 0) {
                    gTweets.GameOfThrones.stats.push(data.stats)
                    getIndividualTweetEngmts(++i)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
    
    
}