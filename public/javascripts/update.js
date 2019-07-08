// $(document).ready(updateStats);
var testStats = {

        'tweet_count':10,
        'likes_count':567,
        'rt_count':324,
        'mentions_count':1435
}

var testHandle = 'elonmusk'
$(document).ready(updateTrackerDisplay(testStats));

function updateStats() {
    // This will, in future, take an array of trackers/handles and update each one
    $.ajax({
        type: 'GET',
        url: '/track/getStats',
        data: { 'handle': handle },
        success: function(data) {
            if (data.status == 0) {
               console.log(data)
               updateTrackerDisplay(data.stats)
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function updateTrackerDisplay(stats) {
    $('#tracker #last-updated').html('Last updated: ' + new Date().toString().split(' GMT')[0])
    trackerEngmtChart(stats, testHandle)
}