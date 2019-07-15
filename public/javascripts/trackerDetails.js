var selectedTweet = -1

$("body").on('click', '#tracker-link-btn', function(e){
    var handle = e.target.outerHTML.split('=')[3].split('"')[1]
    window.trackHandle = handle
    $(location).attr('href', '/tracker?handle=' + handle );
 });
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
     var id = e.target.parentNode.id

     $.ajax({
        type: 'GET',
        url: '/track/tweetEngmt',
        data: {'_id':id},
        success: function(data){
            if(data.status == 0) {
                displayTweetEngmtDetails(data)
            }
            else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
 });

 function displayTweetEngmtDetails(data) {
    var spanBold = '<span style="font-weight:bolder">'

    $('#likes').html(spanBold + 'Likes: </span>' + data.tweet.favourite_count)
    $('#rts').html(spanBold + 'RTs: </span>' + data.tweet.rt_count)
    if(data.tweet.is_rt == 1) $('#is-rt').html('This is a retweet')
    else if(data.tweet.is_rt == 0) $('#is-rt').html('This is not a retweet')
    
    if(data.tweet.text.indexOf('http') == -1) $('#has-link').html('This has no links')
    if(data.tweet.text.indexOf('http') != -1) $('#has-link').html('This has one or more links')

    $('#mentions-b').html(spanBold + 'Mentions before: </span>' + data.mentions_stats.before_mentions)
    $('#mentions-a').html(spanBold + 'Mentions after: </span>' + data.mentions_stats.after_mentions)


    var engmt = calcGatheredStats(data)
    $('#engmt').html('Engagement: ' + engmt)
    generateTweetEngmtChart(data)

    var parts = extractMentionsAndHashtags(data.tweet.text)
    $('#mentions-used').html(spanBold + 'Mentioned users: </span>' + parts.mentions)
    $('#hashtags-used').html(spanBold + 'Hashtags used: </span>' + parts.hashtags)

    var emojies = extractEmojies(data.tweet.text)
    if(emojies != null) 
    $('#emojies-used').html(spanBold + 'Emojies used: </span>' + emojies)
    else 
    $('#emojies-used').html(spanBold + 'Emojies used: </span>None')

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
                // + '<td>' + data.text + '...</td>'
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

/*if(data.tweet.text.indexOf('RT ') != 0) {
                        engmts.push(engmt)
                        
                        hasLinks.push((data.tweet.text.indexOf('http') != -1))
                        l.push('.')
        
                    }*/

  var wL = 1
  var wR = 10
  var lM = 100
function calcGatheredStats(data) {



    var likes = data.tweet.favourite_count
    var rts = data.tweet.rt_count
    var mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions*100
    
    var engmt = (wL * likes) + (wR * rts) + (lM * mentionRatio)
    // console.log('likes: ' + likes + ' rts: ' + rts + ' m: ' + mentionRatio)
    return Math.round(engmt)
}

var texts = []
var engmts = []
var hasLinks = []
var l = []

function generateBarGraph() {
    var rows = $('#tweet-table-body').children()
   
    for(var i in texts) {
        var children = $(rows[i]).children()
        
    }

    var ctx = $('#analysis-section canvas')

    var green = '#14A76C'
    var red = '#FF652F'

    var colours = []
    for(var i in hasLinks) {
        if(hasLinks[i] == true) colours[i] = green
        else colours[i] = red
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: l,
          datasets: [
            {
              label: "Engagement score",
              backgroundColor: colours,
              data: engmts
            }
          ]
        },
        options: {
          legend: { display: false }

        }
    });
}
function generateTweetEngmtChart(data) {
    var ctx = $('#analysis-section canvas')
    var mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions*100
    var mentionColour;
    console.log(mentionRatio)
    if(mentionRatio < 100) mentionColour = '#FF652F'
    else mentionColour = '#14A76C'
    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ["Likes","Retweets", "Mentions Ratio"],

        datasets: [
            {
            backgroundColor: ['#FFE400', '#007BFF', mentionColour],
            data: [(wL*data.tweet.favourite_count), (wR*data.tweet.rt_count), Math.abs(lM*mentionRatio)]
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
$('#analysis-graph-btn').click(generateBarGraph)