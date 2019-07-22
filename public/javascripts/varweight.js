var weightInputs = ['wL', 'wR', 'wM', 'wH', 'wO']
var gTweets = {GameOfThrones:null}

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
            var engmt = calculateEngagementFromWeights(gStats, weights)
            generateTweetEngmtChart(gStats.GameOfThrones, weights)
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

                gTweets.GameOfThrones = data.tweets
                gTweets.GameOfThrones.stats = []
                getIndividualTweetEngmts(0)
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
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