$(document).ready(function () {
  var handle = document.cookie.split('handle=')[1]
  gatherTweets(handle)
  setName(handle)
})
var selectedTweet = -1

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
    var cells = $(e.target.parentNode).children()
    var spanBold = '<span style="font-weight:bolder">'
    $('#likes').html(spanBold + 'Likes: </span>' + $(cells[2]).html())
    $('#rts').html(spanBold + 'RTs: </span>' + $(cells[3]).html())
    $('#mentions-b').html(spanBold + 'Mentions before: </span>' + $(cells[8]).html())
    $('#mentions-a').html(spanBold + 'Mentions after: </span>' + $(cells[9]).html())
    $('#hashtags-b').html(spanBold + 'Hashtags before: </span>' + $(cells[10]).html())
    $('#hashtags-a').html(spanBold + 'Hashtags after: </span>' + $(cells[11]).html())
    $('#other-b').html(spanBold + 'Other before: </span>' + $(cells[12]).html())
    $('#other-s').html(spanBold + 'Other after: </span>' + $(cells[13]).html())

    if($(cells[7]).html() == "true") $('#is-rt').html('This is a retweet')
    else if($(cells[7]).html() == "false") $('#is-rt').html('This is not a retweet')

    console.log($('#stats-row'))
    $('#stats-row').removeClass('hidden')
});

function displayTweetEngmtDetails(data) {
    

    
    
    
    if(data.tweet.text.indexOf('http') == -1) $('#has-link').html('This has no links')
    if(data.tweet.text.indexOf('http') != -1) $('#has-link').html('This has one or more links')

   


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
    $('#tweet-engmt-info').removeClass('hidden')
    console.log("HERE")
 }


function setName (handle) {
  $.ajax({
    type: 'GET',
    url: '/account/getBasicInfo',
    data: {'handle': handle},
    success: function (data) {
      $('#analysis-section h4').html('Analysis - ' + data.name)
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

function gatherTweets (handle) {
  $.ajax({
    type: 'GET',
    url: '/store/getStats',
    data: {'handle': handle},
    success: function (data) {
      if (data.status == 0) {
        for (var i in data.stats) {
          addTweetToTable(data.stats[i])
        }
        createSEngmtChart()
      }
      else if (data.status == -1) console.log('Error')
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

function addTweetToTable (data) {
  var date = new Date(data.created_at).toString().split(' GMT')[0]
  var tableRow = '<tr id="' + data.tweet_id + '">'
    + '<td>' + data.text.slice(0, 40) + '...</td>'
    + '<td>' + date + '</td>'
    + '<td>' + data.favourite_count + '</td>'
    + '<td>' + data.rt_count + '</td>'
    + '<td>Calculating...</td>'
    + '<td class="hidden">' + data.text + '</td>'
    + '<td class="hidden">' + data.created_at + '</td>'
    + '<td class="hidden">' + data.is_rt + '</td>'
    + '<td class="hidden">' + data.stats.before_mentions + '</td>'
    + '<td class="hidden">' + data.stats.after_mentions + '</td>'
    + '<td class="hidden">' + data.stats.before_hashtags + '</td>'
    + '<td class="hidden">' + data.stats.after_hashtags + '</td>'
    + '<td class="hidden">' + data.stats.before_other + '</td>'
    + '<td class="hidden">' + data.stats.after_other + '</td>'


  for (var i in data.url_entities) {
    var html = '<td class="hidden">' + data.url_entities[i] + '</td>'
    tableRow += html
  }

  for (var i in data.media_entities) {
    var html = '<td class="hidden">' + data.media_entities[i].type + ';' + data.media_entities[i].url + '</td>'
    tableRow += html
  }

  tableRow += '</tr>'
  $('#tweet-table-body').append(tableRow)
}

function createSEngmtChart () {
  var ctx = $('#tweet-engmt-info canvas')
  var timeLimits = getLimits()
  // Dates are timestamps here
  var engmts = gatherTweetStats()

  engmts.sort(compare)
  console.log(engmts)

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: engmts,
        label: 'Engagement',
        borderColor: '#14A76C',
        fill: false
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Engagment'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day'
          }
        }]
      }
    }
  })


  $('#tweet-engmt-info').removeClass('hidden')
}

function compare (a, b) {
  if (a.t < b.t) {
    return -1
  }
  if (a.t > b.t) {
    return 1
  }
  return 0
}



function getLimits () {
  var rows = $('#tweet-table-body').children()
  var timestamps = []
  for (var i = 0; i < rows.length; i++) {
    var cells = $(rows[i]).children()
    var timestamp = $(cells[6]).html()
    timestamps.push(timestamp)
  }
  var min = timestamps[0]
  var max = timestamps[0]
  for (var i in timestamps) {
    if (timestamps[i] < min) min = timestamps[i]
    if (timestamps[i] > max) max = timestamps[i]
  }
  return [parseInt(min), parseInt(max)]
}

function getSXAxis (range) {
  var time = range[1] - range[0]
  var numDays = Math.round(time / 86400000)
  var startDate = new Date(range[0])
  startDate.setHours(0)
  startDate.setMinutes(0)
  startDate.setSeconds(0)
  startDate.setMilliseconds(0)


  var vals = []
  for (var i = 0; i <= numDays; i++) {
    vals.push(new Date(startDate).toDateString())
    startDate.setDate(startDate.getDate() + 1)
  }
  return vals
}

function gatherTweetStats () {
  var rows = $('#tweet-table-body').children()
  var engmts = []
  for (var i = 0; i < rows.length; i++) {
    var cells = $(rows[i]).children()

    var data = {
      'tweet': {
        'favourite_count': parseInt($(cells[2]).html()),
        'rt_count': parseInt($(cells[3]).html()),
        'tweet_id': rows[i].id
      },
      'mentions_stats': {
        'before_mentions': parseInt($(cells[8]).html()),
        'after_mentions': parseInt($(cells[9]).html()),
        'before_hashtags': parseInt($(cells[10]).html()),
        'after_hashtags': parseInt($(cells[11]).html()),
        'before_other': parseInt($(cells[12]).html()),
        'after_other': parseInt($(cells[13]).html())
      }
    }
    var engmt = calcGatheredStats(data)
    engmts.push({
      y: engmt,
      t: new Date(parseInt($(cells[6]).html()))
    })
    
    $(cells[4]).html(engmt)
  }
  return engmts
}

var weights = [1, 1, 1, 1, 1]

function calcGatheredStats (data) {
  var likes = data.tweet.favourite_count
  var rts = data.tweet.rt_count
  var mentionRatio = data.mentions_stats.after_mentions
  var hashtagsRatio = data.mentions_stats.after_mentions
  var otherRatio = data.mentions_stats.after_mentions
  if (data.mentions_stats.before_mentions > 0) mentionRatio = data.mentions_stats.after_mentions / data.mentions_stats.before_mentions * 100
  if (data.mentions_stats.before_hashtags > 0) hashtagsRatio = data.mentions_stats.after_hashtags / data.mentions_stats.before_hashtags * 100
  if (data.mentions_stats.before_other > 0) otherRatio = data.mentions_stats.after_other / data.mentions_stats.after_other * 100

  var engmt = (weights[0] * likes) + (weights[1] * rts) + (weights[2] * mentionRatio) + (weights[2] * hashtagsRatio) + (weights[2] * otherRatio)
  return Math.round(engmt)
}
