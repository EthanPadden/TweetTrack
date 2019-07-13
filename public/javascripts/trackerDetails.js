$("body").on('click', '#tracker-link-btn', function(){
    var handle = $('#tracker-link-btn')[0].getAttribute('handle')
    window.trackHandle = handle
    $(location).attr('href', '/tracker?handle=' + handle );
 });

 $(document).ready(function(){
    var handle = document.cookie.split('handle=')[1]

     setTitle(handle)
     gatherTweets(handle)
 })

 function setTitle(handle) {
    $('#analysis-section h4').html('Analysis - ' + handle)
 }

 function gatherTweets(handle) {
    $.ajax({
        type: 'GET',
        url: '/track/getTweets',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                for(var i in data.tweets) {
                    addTweetToTable(data.tweets[i])
                }

                gatherEngmtStats(0)
            }
            else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
 }

 function addTweetToTable(data) {
    var tableRow = '<tr id="' + data._id + '">'
                + '<td>' + data.text.slice(0,40) + '...</td>'
                + '<td>' + data.created_at.split(' IST')[0] + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td>Calculating...</td>'
                + '</tr>';
                var tableHTML = $('#tweet-table-body').html();
                tableHTML += tableRow;
                $('#tweet-table-body').html(tableHTML);
}

function gatherEngmtStats(i) {
    if(i >= $('#tweet-table-body').children().length) {
        console.log("Base case")
        return
    }
    else {
        var id = $('#tweet-table-body').children()[i].id
        console.log("Requesting " + id)
        $.ajax({
            type: 'GET',
            url: '/track/tweetEngmt',
            data: {'_id':id},
            success: function(data){
                console.log("SUCCESS - " + id)
                if(data.status == 0) {
                    var engmt = calcGatheredStats(data)
                    var row = $('#tweet-table-body').children()[i]
                    var cell = $(row).children()[4]
                    $(cell).html(engmt)
                    gatherEngmtStats(++i)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
}

// {
//     "status": 0,
//     "tweet": {
//       "_id": "5d267459c19495b26e8de32b",
//       "handle": "elonmusk",
//       "tracker_id": "5d25b16dc19495b26e8dde5a",
//       "tweet_id": "1149097786991767552",
//       "created_at": "Thu Jul 11 00:27:16 IST 2019",
//       "text": "RT @cleantechnica: Tesla Model 3 Awarded 2019 Car Of The Year By UK’s Auto Express — Reflections On UK Media Coverage https://t.co/atijYV4R…",
//       "favourite_count": 0,
//       "rt_count": 0,
//       "is_rt": 1
//     },
//     "mentions_stats": {
//       "before_mentions": 267,
//       "after_mentions": 1040
//     }
//   }

  var wL = 1
  var wR = 10
  var lM = 20
function calcGatheredStats(data) {
    var likes = data.tweet.favourite_count
    var rts = data.tweet.rt_count
    var mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions
    
    var engmt = (wL * likes) + (wR * rts) + (lM * mentionRatio)
    return Math.round(engmt)
}