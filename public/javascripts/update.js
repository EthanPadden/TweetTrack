$(document).ready(getRunningTrackers)

function getRunningTrackers() {
    $.ajax({
        type: 'GET',
        url: '/track/runningTrackers',
        success: function(data) {
            if (data.status == 0) {
               console.log(data)
               for(var i in data.trackers) {
               constructTracker(data.trackers[i].handle)
                   
               }
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

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