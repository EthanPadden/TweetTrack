// Get tracker ID from cookies and gather information
$(document).ready(function () {
  var trackerId = document.cookie.split('tracker_id=')[1]
  getTracker(trackerId) // Call step 1
  gatherTweets(trackerId) // Call step 4
})

// 1. Get tracker information
function getTracker (trackerId) {
  $.ajax({
    type: 'GET',
    url: '/track/getTracker',
    data: {'tracker_id': trackerId},
    success: function (data) {
      if (data.status == 0) {
        getServerAccountInfo(data.tracker.handle) // Call step 2
      }
      else console.log('Tracker not found')
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

// 2. Get name of account
function getServerAccountInfo (handle) {
  $.ajax({
    type: 'GET',
    url: '/account/getBasicInfo',
    data: {'handle': handle},
    success: function (data) {
      if (data.status == 0) {
        setTitle(data.name) // Call step 3
      }
      else if (data.status == -1) $('#handle-msg').html('Account not found')
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

// 3. Set the title of the page
function setTitle (name) {
  $('#analysis-section h4').html('Analysis - ' + name)
}

// 4. Get tweets from server
function gatherTweets (trackerId) {
  $.ajax({
    type: 'GET',
    url: '/track/getTweets',
    data: {'tracker_id': trackerId},
    success: function (data) {
      if (data.status == 0) {
        // Loop through tweets and call step 5 for each
        for (var i in data.tweets) {
          addTweetToTable(data.tweets[i])
        }

        gatherEngmtStats(0) // Call step 6
      }
      else if (data.status == -1) console.log('Error')
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

// 5. Create HTML for tweets and append to table body
function addTweetToTable (data) {
  var tableRow = '<tr id="' + data._id + '">'
    + '<td>' + data.text.slice(0, 40) + '...</td>'
    // + '<td>' + data.text + '...</td>'
    + '<td>' + data.created_at.split(' IST')[0] + '</td>'
    + '<td>' + data.favourite_count + '</td>'
    + '<td>' + data.rt_count + '</td>'
    + '<td>Calculating...</td>'
    + '<td class="hidden">' + data.is_rt + '</td>'
    + '<td class="hidden">-1</td>'
    + '<td class="hidden">-1</td>'
    + '</tr>'
  var tableHTML = $('#tweet-table-body').html()
  tableHTML += tableRow
  $('#tweet-table-body').html(tableHTML)
}

// 6. Recursively loop through tweets and get engagement statistics from server
function gatherEngmtStats (i) {
  if (i >= $('#tweet-table-body').children().length) {
    return
  }else {
    var id = $('#tweet-table-body').children()[i].id
    $.ajax({
      type: 'GET',
      url: '/track/tweetEngmt',
      data: {'_id': id},
      success: function (data) {
        if (data.status == 0) {
          var engmt = calculateTweetEngagement(data)
          var row = $('#tweet-table-body').children()[i]
          var cell = $(row).children()[4]
          $(cell).html(engmt)
          gatherEngmtStats(++i)
          appendEngmtStatsToTweetRow(id, data) // Call step 7
        }
        else if (data.status == -1) console.log('Error')
      },
      error: function (errMsg) {
        console.log(errMsg)
      }
    })
  }
}

// 7. Store engagement statistics as HTML on page
function appendEngmtStatsToTweetRow (tweetId, data) {
  var row = $('#' + tweetId)
  var cells = $(row).children()
  $(cells[6]).html(data.mentions_stats.before_mentions)
  $(cells[7]).html(data.mentions_stats.after_mentions)
}

// Table UI functions
var selectedTweet = -1

$('body').on('mouseenter', '#tweet-table-body tr', function (e) {
  var select = e.target.parentNode
  if (select != selectedTweet)
    $(select).css('background-color', '#96BFFF')
})

$('body').on('mouseleave', '#tweet-table-body tr', function (e) {
  var select = e.target.parentNode
  if (select != selectedTweet)
    $(select).css('background-color', '#FFFFFF')
})

$('body').on('click', '#tweet-table-body tr', function (e) {
  $(selectedTweet).css('background-color', '#FFFFFF')
  $(selectedTweet).css('color', '#212529')
  $(e.target.parentNode).css('background-color', '#007BFF')
  $(e.target.parentNode).css('color', '#FFFFFF')
  selectedTweet = e.target.parentNode
})

// Listener for calling tweet detail functions
$('body').on('click', '#tweet-table-body', function (e) {
  var stats = extractStoredTweetEngmtStats(e.target.parentNode)
  if (stats.status == -1) alert('Please wait until engagement is calculated')
  else if (stats.status == 0) {
    displayTweetEngmtDetails(stats)
    generateTweetEngmtChart(stats, $('#analysis-section canvas'))
  }
})

// Tweet detail functions
function displayTweetEngmtDetails (data) {
  var spanBold = '<span style="font-weight:bolder">'

  $('#likes').html(spanBold + 'Likes: </span>' + data.favourite_count)
  $('#rts').html(spanBold + 'RTs: </span>' + data.retweet_count)
  if (data.is_rt == 1) $('#is-rt').html('This is a retweet')
  else if (data.is_rt == 0) $('#is-rt').html('This is not a retweet')

  if (data.text.indexOf('http') == -1) $('#has-link').html('This has no links')
  if (data.text.indexOf('http') != -1) $('#has-link').html('This has one or more links')

  $('#mentions-b').html(spanBold + 'Mentions before: </span>' + data.mentions_b)
  $('#mentions-a').html(spanBold + 'Mentions after: </span>' + data.mentions_b)

  $('#engmt').html('Engagement: ' + data.engagement)
  var parts = extractMentionsAndHashtags(data.text)
  $('#mentions-used').html(spanBold + 'Mentioned users: </span>' + parts.mentions)
  $('#hashtags-used').html(spanBold + 'Hashtags used: </span>' + parts.hashtags)

  var emojies = extractEmojies(data.text)
  if (emojies != null)
    $('#emojies-used').html(spanBold + 'Emojies used: </span>' + emojies)
  else
    $('#emojies-used').html(spanBold + 'Emojies used: </span>None')
  $('#tweet-engmt-info').removeClass('hidden')
}

function extractStoredTweetEngmtStats (row) {
  var cells = $(row).children()
  var status
  if ($(cells[4]).html() == 'Calculating...') status = -1
  else status = 0
  return {
    'status': status,
    'text': $(cells[0]).html(),
    'favourite_count': $(cells[2]).html(),
    'retweet_count': $(cells[3]).html(),
    'engagement': $(cells[4]).html(),
    'is_rt': $(cells[5]).html(),
    'mentions_b': $(cells[6]).html(),
    'mentions_a': $(cells[7]).html()
  }
}