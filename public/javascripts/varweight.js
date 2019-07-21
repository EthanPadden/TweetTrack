var weightInputs = ['wL', 'wR', 'wM', 'wH', 'wO']

$('#calc-w-btn').click(function(){
    var weights = []
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
                        getTweets(weights)
                    } else if(data.status) console.log("Error: status " + data.status);
                    else console.log("Error: no status available");
                },
                error: function(errMsg) {
                    console.log(errMsg);
                }
            });
        } else {

        }
    }
})

function getTweets(weights) {
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
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

