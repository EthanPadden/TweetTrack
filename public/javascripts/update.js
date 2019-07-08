$(document).ready(updateStats);

function updateStats() {
    // This will, in future, take an array of trackers/handles and update each one
    $.ajax({
        type: 'GET',
        url: '/track/getStats',
        data: { 'handle': handle },
        success: function(data) {
            if (data.status == 0) {
               console.log(data)
            } else if(data.status) console.log("Error: status " + data.status);
            else console.log("Error: no status available");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}