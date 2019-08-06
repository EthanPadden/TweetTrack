$(document).ready(getRunningTrackers)

function getRunningTrackers() {
    $.ajax({
        type: 'GET',
        url: '/track/runningTrackers',
        success: function(data) {
            if (data.status == 0) {
               for(var i in data.trackers) {
                   var handle = data.trackers[i].handle
                   var isTracking = (data.trackers[i].status == 1)
                   addAccount(handle, isTracking, data.trackers[i])
                    constructTracker(handle)
               }

                   updateStats(data.trackers, 0)
         

               

            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}





function updateStats(trackers, i) {
    if(i >= trackers.length) return
    $.ajax({
        type: 'GET',
        url: '/track/getStats',
        data: { 'handle': trackers[i].handle },
        success: function(data) {
            if (data.status == 0) {
               updateTrackerDisplay(data.stats, trackers[i].handle)
               updateStats(trackers, ++i)

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