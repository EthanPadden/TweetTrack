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

  var likes = parseInt($(cells[2]).html())
  var rts = parseInt($(cells[3]).html())
   var beforeMentions = parseInt($(cells[8]).html())
   var afterMentions = parseInt($(cells[9]).html())
   var beforeHashtags = parseInt($(cells[10]).html())
   var afterHashtags = parseInt($(cells[11]).html())
   var beforeOther = parseInt($(cells[12]).html())
   var afterOther = parseInt($(cells[13]).html())

    var spanBold = '<span style="font-weight:bolder">'
    $('#tweet-engmt').html(spanBold + 'Engagement: </span>' + $(cells[4]).html())
    $('#likes').html(spanBold + 'Likes: </span>' + likes)
    $('#rts').html(spanBold + 'RTs: </span>' + rts)
    $('#mentions-b').html(spanBold + 'Mentions before: </span>' + beforeMentions)
    $('#mentions-a').html(spanBold + 'Mentions after: </span>' + afterMentions)
    $('#hashtags-b').html(spanBold + 'Hashtags before: </span>' + beforeHashtags)
    $('#hashtags-a').html(spanBold + 'Hashtags after: </span>' + afterHashtags)
    $('#other-b').html(spanBold + 'Other before: </span>' + beforeOther)
    $('#other-a').html(spanBold + 'Other after: </span>' + afterOther)

    if($(cells[7]).html() == "true") $('#is-rt').html('This is a retweet')
    else if($(cells[7]).html() == "false") $('#is-rt').html('This is not a retweet')

    var extractRes = extractMentionsAndHashtags($(cells[5]).html())
    $('#mentions-used').html(spanBold + 'User mentions: </span>' + extractRes.mentions)
    $('#hashtags-used').html(spanBold + 'Hashtags used: </span>' + extractRes.hashtags)
    $('#emojies-used').html(spanBold + 'Emojies used: </span>' + extractEmojies($(cells[5]).html()))

    $('#stats-row').removeClass('hidden')
    var data = {
      'tweet':{
        'favourite_count':likes,
        'rt_count':rts
      },
      'mentions_stats':{
        'before_mentions':beforeMentions,
        'after_mentions':afterMentions,
        'before_hashtags':beforeHashtags,
        'after_hashtags':afterHashtags,
        'before_other':beforeOther,
        'after_other':afterOther
      }
    }

    generateTweetEngmtChart(data)
});
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
  // var emojiRegex = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;
  var emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  if(text.match(emojiRegex) == null) return []
  return text.match(emojiRegex)
      
}

 function generateTweetEngmtChart(data) {
  var ctx = $('#stats-row canvas')
  console.log(ctx)
  var mentionRatio = data.mentions_stats.after_mentions*100
  if(data.mentions_stats.before_mentions > 0) mentionRatio = data.mentions_stats.after_mentions/data.mentions_stats.before_mentions*100
  var hashtagsRatio = data.mentions_stats.after_hashtags*100
  if(data.mentions_stats.before_hashtags > 0) hashtagsRatio = data.mentions_stats.after_hashtags/data.mentions_stats.before_hashtags*100
  var otherRatio = data.mentions_stats.after_other*100
  if(data.mentions_stats.before_other > 0) otherRatio = data.mentions_stats.after_other/data.mentions_stats.before_other*100

  
  if(mentionRatio < 100) mentionColour = '#FF652F'
  else mentionColour = '#14A76C'
  new Chart(ctx, {
      type: 'pie',
      data: {
      labels: ["Likes","Retweets", "Mentions", "Hashtags", "Other"],

      datasets: [
          {
          backgroundColor: ['#FFE400', '#007BFF', '#14A76C','#FF652F', '#000000'],
          data: [(weights[0]*data.tweet.favourite_count), (weights[1]*data.tweet.rt_count), Math.abs(weights[2]*mentionRatio), Math.abs(weights[2]*hashtagsRatio), Math.abs(weights[2]*otherRatio)]
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

var weights = [1, 1, 0, 0, 0]

function calcGatheredStats (data) {
  var likes = data.tweet.favourite_count
  var rts = data.tweet.rt_count
  var mentionRatio = data.mentions_stats.after_mentions
  var hashtagsRatio = data.mentions_stats.after_mentions
  var otherRatio = data.mentions_stats.after_mentions
  if (data.mentions_stats.before_mentions > 0) mentionRatio = data.mentions_stats.after_mentions / data.mentions_stats.before_mentions * 100
  if (data.mentions_stats.before_hashtags > 0) hashtagsRatio = data.mentions_stats.after_hashtags / data.mentions_stats.before_hashtags * 100
  if (data.mentions_stats.before_other > 0) otherRatio = data.mentions_stats.after_other / data.mentions_stats.after_other * 100

  var engmt = (weights[0] * likes) + (weights[1] * rts) + (weights[2] * mentionRatio) + (weights[3] * hashtagsRatio) + (weights[4] * otherRatio)
  return Math.round(engmt)
}
