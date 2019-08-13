var trackerIndex = -1;
var started = false

function displayTracker(i) {
    $('#tracker h4').html('Tracking ' + window.accounts[i].name + '...')
    var startDate = new Date().toDateString();
    $('#tracker #start-date').html('Started: ' +startDate)
    $('#tracker').removeClass('hidden')
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
