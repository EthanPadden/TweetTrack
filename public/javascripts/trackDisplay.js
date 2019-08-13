/* Default call for past week
Get todays date
Get day of week => get mondays date
Make ajax request for that date
*/

var trackerIndex = -1;

var started = false
$('#track-tab').click(function(event) {
    // Display current trackers
})

$('#add-tracker-btn').click(function(event) {
    // Find the index of the selected option
    var index = $('#account-dropdown-track option:selected').index();

    // Find the handle of the selected account from array of data
    var handle = window.accounts[index].handle;

    $.ajax({
        type: 'GET',
        url: '/track/trackUser',
        data: { 'handle': handle },
        success: function(data) {
            if (data.status == 0) {
                trackerIndex = index;
               updateTrackingStatus(index, 1)
               displayTracker(index)
            } else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
});

function displayTracker(i) {
    $('#tracker h4').html('Tracking ' + window.accounts[i].name + '...')
    var startDate = new Date().toDateString();
    $('#tracker #start-date').html('Started: ' +startDate)
    $('#tracker').removeClass('hidden')
}

$('#stop-track-btn').click(function() {
    /*
    updateTrackingStatus(trackerIndex, 2)
    $.ajax({
        type: 'GET',
        url: '/track/killTracker',
        data: { 'handle': window.accounts[trackerIndex].handle },
        success: function(data) {
            updateTrackingStatus(trackerIndex, 0)
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
    */
})
// function getPreviousMonday () {
//   var date = new Date()
//   var day = date.getDay()
//   var prevMonday
//   if (date.getDay() == 0) {
//     prevMonday = new Date().setDate(date.getDate() - 7)
//   } else {
//     prevMonday = new Date().setDate(date.getDate() - day)
//   }

//   var prevMondayDate = new Date(prevMonday)
//   console.log(prevMondayDate.toString())
//   var d = prevMonday.getDate().toString()
//   if (d.length == 1) num = '0' + num
//   var m = prevMonday.getMonth().toString()
//   if (m.length == 1) num = '0' + num
//   return d + '/' + m + '/' + date.getFullYear()
// }

function getMonday(d) {
    var prevMonday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() - 6) // -7+1
    var d = prevMonday.getDate().toString()
    if (d.length == 1) d = '0' + d
    var m = (prevMonday.getMonth() + 1).toString()
    if (m.length == 1) m = '0' + m

    var startDate = d + '/' + m + '/' + prevMonday.getFullYear().toString()

    var nextMonday = prevMonday;
    nextMonday.setDate(prevMonday
        .getDate() + 7);

    // If next Monday is in the future
    var today = new Date();
    if (nextMonday.getTime() > today.getTime()) nextMonday = today;

    var d = nextMonday.getDate().toString()
    if (d.length == 1) d = '0' + d
    var m = (nextMonday.getMonth() + 1).toString()
    if (m.length == 1) m = '0' + m
    var endDate = d + '/' + m + '/' + nextMonday.getFullYear().toString()
    return [startDate, endDate];
}

function constructTracker(handle) {
    var html = '<div class="row no-margin tracker" id="tracker-' + handle + '">'
    + '<div class="col-1"></div>'
    + '<div class="col-10">'
    + '<div class="card">'
    + '<div class="card-body">'
    + '<div class="row">'
    + '<div class="col-8"><h4 id="name">Tracker - </h4></div>'
    + '<div class="col-2"><button type="button" class="btn btn-info" handle="' + handle + '" id="tracker-link-btn">Analysis</button></div>'
    + '<div class="col-2"><button type="button" class="btn btn-danger" handle="' + handle + '" id="stop-track-btn">Stop</button></div>'
    + '</div>'
     +   '<div class="row">'
      +    '<div class="col-4" id="start-date">Started: </div>'

       +   '<div class="col-3" id="status">Status: </div>'

        +  '<div class="col-5" id="last-updated">Last updated: </div>'

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

    var currentHtml = 
    $('#tracker-section > div.col').html()

    $('#tracker-section > div.col').html(currentHtml + html)
}

function displayTrackerDetails(tracker) {
    // console.log(tracker)
    // console.log(accounts)
    var statusStr
    if(tracker.status == 1) statusStr = 'tracking'
    else if(tracker.status == 0) statusStr = 'stopped'

    var selector = '#tracker-section #tracker-' + tracker.handle
   
    $(selector + ' #start-date').html('Started: ' + tracker.start_date.split(' IST')[0])    
    $(selector + ' #status').html('Status: ' + statusStr)  
    $(selector + ' div.card-body')[0].id = tracker._id
    
    var account = findAccount(accounts, tracker.handle)
    var name = account.name
    $(selector + ' #name').html('Tracker - ' + name)
}

function findAccount(arr, handle) {
    for(var i in arr) {
        if(arr[i].handle == handle) return arr[i]
    }

    return null
}
