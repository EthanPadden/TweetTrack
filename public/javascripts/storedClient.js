$(document).ready(function() {
    var handle = document.cookie.split('handle=')[1]
    gatherTweets(handle)
    setName(handle)
})

function setName(handle) {
    $.ajax({
        type: 'GET',
        url: '/account/getBasicInfo',
        data: {'handle':handle},
        success: function(data){
           $('#analysis-section h4').html('Analysis - ' + data.name)
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}



function gatherTweets(handle) {
    $.ajax({
        type: 'GET',
        url: '/store/getStats',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                for(var i in data.stats) {
                    addTweetToTable(data.stats[i])
                }
                createSEngmtChart()

            }
            else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
 }


 function addTweetToTable(data) {
     var date = new Date(data.created_at).toString().split(' GMT')[0]
    var tableRow = '<tr id="' + data._id + '">'
                + '<td>' + data.text.slice(0,40) + '...</td>'
                + '<td>' + date + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td class="hidden">' + data.text + '</td>'
                + '<td class="hidden">' + data.created_at + '</td>'
                + '<td class="hidden">' + data.is_rt + '</td>'
                + '<td class="hidden">' + data.stats.before_mentions + '</td>'
                + '<td class="hidden">' + data.stats.after_mentions + '</td>'
                + '<td class="hidden">' + data.stats.before_hashtags + '</td>'
                + '<td class="hidden">' + data.stats.after_hashtags + '</td>'
                + '<td class="hidden">' + data.stats.before_other + '</td>'
                + '<td class="hidden">' + data.stats.after_other + '</td>'
                

    for(var i in data.url_entities) {
        var html = '<td class="hidden">' + data.url_entities[i] + '</td>'
        tableRow += html
    }

    for(var i in data.media_entities) {
        var html = '<td class="hidden">' + data.media_entities[i].type + ';' + data.media_entities[i].url + '</td>'
        tableRow += html
    }
                
    tableRow += '</tr>'
    $('#tweet-table-body').append(tableRow);
}

function createSEngmtChart() {
    var ctx = $('#tweet-engmt-info canvas')
    var timeLimits = getLimits()
    var vals = getSXAxis(timeLimits)
    var engmts = []
    gatherTweetStats()

    // new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: vals,
    //         datasets: [{ 
    //             data: [],
    //             label: "Engagement",
    //             borderColor: "#3e95cd",
    //             fill: false
    //           }]
    //       },
    //     options: {
    //       title: {
    //         display: true,
    //         text: 'Engagment'
    //       }
    //     }
    //   });

    // $('#tweet-engmt-info').removeClass('hidden')
      
}

function getLimits() {
    var rows = $('#tweet-table-body').children()
    var timestamps = []
    for(var i = 0; i < rows.length; i++) {
        var cells = $(rows[i]).children()
        var timestamp = $(cells[5]).html()
        timestamps.push(timestamp)
    }
    var min = timestamps[0]
    var max = timestamps[0]
    for(var i in timestamps) {
        if(timestamps[i] < min) min = timestamps[i]
        if(timestamps[i] > max) max = timestamps[i]
    }
    return [parseInt(min), parseInt(max)]
}

function getSXAxis(range) {
    var time = range[1] - range[0]
    var numDays = Math.round(time/86400000)
    var startDate = new Date(range[0])
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    

    var vals = []
    for(var i = 0; i <= numDays; i++) {
        vals.push(new Date(startDate).toDateString())
        startDate.setDate(startDate.getDate() + 1);
    }
    return vals
    // var vals = [new Date(range[0]-step)]
    // for(var i = 0; i < 8; i++) {
    //     vals.push(new Date(range[0] + (i*step)))
    // }
    // return vals

    // Get date of min and max
    // Divide into days
    
}

function getEngmts() {
    gatherTweetStats()
}

function gatherTweetStats() {
    var rows = $('#tweet-table-body').children()

    for(var i = 0; i < rows.length; i++) {
        var cells = $(rows[i]).children()
        var data = {
            'tweet': {
                'favourite_count':parseInt($(cells[2]).html()),
                'rt_count':parseInt($(cells[3]).html())
            },
            'mentions_stats':{
                'before_mentions':parseInt($(cells[9]).html()),
                'after_mentions':parseInt($(cells[10]).html()),
                'before_hashtags':parseInt($(cells[11]).html()),
                'after_hashtags':parseInt($(cells[12]).html()),
                'before_other':parseInt($(cells[13]).html()),
                'after_other':parseInt($(cells[14]).html())
            }
        }
        console.log(data)
    }
}

var weights = [1,1,1,1,1]

function calcGatheredStats(data) {
    var likes = data.tweet.favourite_count
    var rts = data.tweet.rt_count
    var mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions*100
    
    var engmt = (wL * likes) + (wR * rts) + (lM * mentionRatio)
    // console.log('likes: ' + likes + ' rts: ' + rts + ' m: ' + mentionRatio)
    return Math.round(engmt)
}