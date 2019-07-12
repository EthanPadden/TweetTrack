$(document).ready(getRunningTrackers)

function getRunningTrackers() {
    $.ajax({
        type: 'GET',
        url: '/track/runningTrackers',
        success: function(data) {
            if (data.status == 0) {
            //    console.log(data)
               for(var i in data.trackers) {
                   var handle = data.trackers[i].handle
                   addAccount(handle, true)
                    constructTracker(handle)
                   updateStats(handle)
               }

               processReturnedTrackers(data.trackers, 0)

               

            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function processReturnedTrackers(trackers, i) {
    if(i >= trackers.length) return
    setTimeout(function(){
        console.log(trackers[i])
        displayTrackerDetails(trackers[i])
        processReturnedTrackers(trackers, ++i)
 }, 3000)
}

function updateStats(handle) {
    $.ajax({
        type: 'GET',
        url: '/track/getStats',
        data: { 'handle': handle },
        success: function(data) {
            if (data.status == 0) {
            //    console.log("STATS RETURNED " + handle)
                // console.log(data)
               updateTrackerDisplay(data.stats, handle)
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