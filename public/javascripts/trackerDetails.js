var selectedTweet = -1

 $(document).ready(function(){
    var trackerId = document.cookie.split('tracker_id=')[1]
    getTracker(trackerId)
    gatherTweets(trackerId)
 })

 function getTracker(trackerId) {
    $.ajax({
        type: 'GET',
        url: '/track/getTracker',
        data: {'tracker_id':trackerId},
        success: function(data){
            if(data.status == 0) {
                getServerAccountInfo(data.tracker.handle)
            }
            else console.log("Tracker not found");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function getServerAccountInfo(handle) {
    $.ajax({
        type: 'GET',
        url: '/account/getBasicInfo',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                setTitle(data.name)
            }
            else if (data.status == -1) $('#handle-msg').html("Account not found");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

 $("body").on('mouseenter', '#tweet-table-body tr', function(e){
    var select = e.target.parentNode
    if(select != selectedTweet)
   $(select).css('background-color', '#96BFFF')
 })

 $("body").on('mouseleave', '#tweet-table-body tr', function(e){
     var select = e.target.parentNode
     if(select != selectedTweet)
    $(select).css('background-color', '#FFFFFF')

 })

 $("body").on('click', '#tweet-table-body tr', function(e){
    $(selectedTweet).css('background-color', '#FFFFFF')
    $(selectedTweet).css('color', '#212529')
    $(e.target.parentNode).css('background-color', '#007BFF')
    $(e.target.parentNode).css('color', '#FFFFFF')
    selectedTweet = e.target.parentNode
 })


 
 $("body").on('click', '#tweet-table-body', function(e){
    var stats = extractStoredTweetEngmtStats(e.target.parentNode)
    if(stats.status == -1) alert("Please wait until engagement is calculated")
    else if (stats.status == 0) {
        displayTweetEngmtDetails(stats)
        generateTweetEngmtChart(stats, $('#analysis-section canvas'))
    }
 });

 function displayTweetEngmtDetails(data) {
     // Next change here
    var spanBold = '<span style="font-weight:bolder">'

    $('#likes').html(spanBold + 'Likes: </span>' + data.favourite_count)
    $('#rts').html(spanBold + 'RTs: </span>' + data.retweet_count)
    if(data.is_rt == 1) $('#is-rt').html('This is a retweet')
    else if(data.is_rt == 0) $('#is-rt').html('This is not a retweet')
    
    if(data.text.indexOf('http') == -1) $('#has-link').html('This has no links')
    if(data.text.indexOf('http') != -1) $('#has-link').html('This has one or more links')

    $('#mentions-b').html(spanBold + 'Mentions before: </span>' + data.mentions_b)
    $('#mentions-a').html(spanBold + 'Mentions after: </span>' + data.mentions_b)


    // var engmt = calcGatheredStats(data)
    $('#engmt').html('Engagement: ' + data.engagement)
    // generateTweetEngmtChart(data)

    var parts = extractMentionsAndHashtags(data.text)
    $('#mentions-used').html(spanBold + 'Mentioned users: </span>' + parts.mentions)
    $('#hashtags-used').html(spanBold + 'Hashtags used: </span>' + parts.hashtags)

    var emojies = extractEmojies(data.text)
    if(emojies != null) 
    $('#emojies-used').html(spanBold + 'Emojies used: </span>' + emojies)
    else 
    $('#emojies-used').html(spanBold + 'Emojies used: </span>None')
    $('#tweet-engmt-info').removeClass('hidden')
 }


function extractMentionsAndHashtags(text){
    var words = text.split(' ')
    var mentions = []
    var hashtags = []

    for(var i in words) {
        if(words[i].indexOf('@') == 0) mentions.push(words[i])
        if(words[i].indexOf('#') == 0) hashtags.push(words[i])
    }

    return {
        'mentions':mentions,
        'hashtags':hashtags
    }
}

function extractEmojies(text) {
    var emojiRegex = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;

    var emojies = []
    // for(var i in text) {
    //     if (text[i].match(emojiRegex)) {
    //         emojies.push(text[i])
    //     }
    // }

    return text.match(emojiRegex)
        
}


 function setTitle(name) {
    $('#analysis-section h4').html('Analysis - ' + name)
 }

 function gatherTweets(trackerId) {
    $.ajax({
        type: 'GET',
        url: '/track/getTweets',
        data: {'tracker_id':trackerId},
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
                // + '<td>' + data.text + '...</td>'
                + '<td>' + data.created_at.split(' IST')[0] + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td>Calculating...</td>'
                + '<td class="hidden">' + data.is_rt + '</td>'
                + '<td class="hidden">-1</td>'
                + '<td class="hidden">-1</td>'
                + '</tr>';
                var tableHTML = $('#tweet-table-body').html();
                tableHTML += tableRow;
                $('#tweet-table-body').html(tableHTML);
}

function appendEngmtStatsToTweetRow(tweetId, data) {
   var row = $('#' + tweetId)
   var cells = $(row).children()
   $(cells[6]).html(data.mentions_stats.before_mentions)
   $(cells[7]).html(data.mentions_stats.after_mentions)
}

function gatherEngmtStats(i) {
    if(i >= $('#tweet-table-body').children().length) {
        return
    }
    else {
        var id = $('#tweet-table-body').children()[i].id
        $.ajax({
            type: 'GET',
            url: '/track/tweetEngmt',
            data: {'_id':id},
            success: function(data){
                if(data.status == 0) {
                    var engmt = calculateTweetEngagement(data)
                    var row = $('#tweet-table-body').children()[i]
                    var cell = $(row).children()[4]
                    $(cell).html(engmt)
                    gatherEngmtStats(++i)
                    appendEngmtStatsToTweetRow(id, data)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
}

function extractStoredTweetEngmtStats(row) {
    var cells = $(row).children()
    var status
    if($(cells[4]).html() == 'Calculating...') status = -1
    else status = 0
    return {
        'status':status,
        'text':$(cells[0]).html(),
        'favourite_count':$(cells[2]).html(),
        'retweet_count':$(cells[3]).html(),
        'engagement':$(cells[4]).html(),
        'is_rt':$(cells[5]).html(),
        'mentions_b':$(cells[6]).html(),
        'mentions_a':$(cells[7]).html(),
    }
}
/*if(data.tweet.text.indexOf('RT ') != 0) {
                        engmts.push(engmt)
                        
                        hasLinks.push((data.tweet.text.indexOf('http') != -1))
                        l.push('.')
        
                    }*/
