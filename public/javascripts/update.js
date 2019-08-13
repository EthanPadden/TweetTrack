$(document).ready(getRunningTrackers)

function getRunningTrackers() {
    $.ajax({
        type: 'GET',
        url: '/track/runningTrackers',
        success: function(data) {
            if (data.status == 0) {
               for(var i in data.trackers) {
                   addAccount(data.trackers[i])
                   buildTracker(data.trackers[i])
               }
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function updateTrackerDisplay(stats, handle) {
    var selector = '#tracker-section #tracker-' + handle + ' #last-updated'
    $(selector).html('Last updated: ' + new Date().toString().split(' GMT')[0])
    trackerEngmtChart(stats, handle)
}