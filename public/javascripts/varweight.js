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
                var tweetStats = getStatsFromTweets(data.tweets)
                gStats.GameOfThrones.avg_likes = tweetStats.avg_likes
                gStats.GameOfThrones.avg_rts = tweetStats.avg_rts

                var engmt = calculateEngagementFromWeights(gStats, weights)
                generateTweetEngmtChart(gStats.GameOfThrones, weights)


                for(var i in data.tweets) {
                    addTweetToTable(data.tweets[i])
                }

                // Table has been created at this point
                getIndividualTweetEngmts(0)
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

function getIndividualTweetEngmts(i) {
    var tableBody = $('#GOT-table tbody')[0]
    var rows = $(tableBody).children()

    if(i >= rows.length) console.log("Done")
    else {
        $.ajax({
            type: 'GET',
            url: '/got/tweetEngmt',
            data: {'_id':rows[i].id},
            success: function(data){
                if(data.status == 0) {
                    // var html = '<td'
                   var cells = $(rows[i]).children()
                    data.stats.likes = parseInt($(cells[3]).html())
                    data.stats.rts = parseInt($(cells[4]).html())
                    var engmt = calculateTweetEngagement(data.stats, weights)
                    
                    $(cells[1]).html(engmt)
                    // getIndividualTweetEngmts(++i)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
}