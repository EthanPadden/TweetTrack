function buildTracker(tracker, followersCount) {
    $.ajax({
        type: 'GET',
        url: '/track/getStats',
        data: { 'id': tracker._id },
        success: function(data) {
            if (data.status == 0) trackerHTML(tracker, data.stats, followersCount)
            else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function trackerHTML(tracker, stats, followersCount) {
    var status = statusHTML(tracker.status)

    // TODO: Change system so that stats are stored in correct format:
    var statsInput = {
        tweet_count:stats.tweet_count,
        followers_count:followersCount,
        favourite_count:stats.likes_count,
        retweet_count:stats.rt_count,
        mention_count:stats.mentions_count
    }

    var engmtStats = calculateEngagement(statsInput)
    var html = '<div class="row no-margin tracker" id="tracker-' + tracker._id + '">'
    + '<div class="col-1"></div>'
    + '<div class="col-10">'
    + '<div class="card">'
    + '<div class="card-body">'
    + '<div class="row">'
    + '<div class="col-8"><h4 id="name">Tracker - </h4></div>'
    + '<div class="col-2"><button type="button" class="btn btn-info" id="tracker-link-btn">Analysis</button></div>'
    + '<div class="col-2"><button type="button" class="btn btn-danger" id="stop-track-btn">Stop</button></div>'
    + '</div>'
     +   '<div class="row">'
      +    '<div class="col-4" id="start-date">Started: ' + new Date(tracker.start_date).toDateString() + '</div>'
       +   '<div class="col-3" id="status">Status: ' + status + '</div>'
        +  '<div class="col-5" id="last-updated">Last updated: ' + new Date().toDateString() + '</div>'

        +'</div>'
        +'<div class="row">'
        + '<div class="col-6"><canvas id="engmt-chart"></canvas></div>'
         + '<div class="col-6">'
          +  '<div><strong id="engmt">Engagement: </strong></div>'
          +  '<div id="avg-likes">Average Likes: </div>'
           + '<div id="avg-rts">Average Retweets: </div>'
            +'<div id="mentions">Mentions: </div>'
         + '</div></div></div></div></div>'
+  '<div class="col-1"></div></div>'

$('#tracker-section > div.col').append(html)
}