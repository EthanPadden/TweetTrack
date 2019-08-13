var greenTheme = 'rgba(20, 167, 108, 1)';
var yellowTheme = 'rgba(255, 228, 0, 1)';
var accounts = [];

function addAccount(tracker) {
    $.ajax({
        type: 'GET',
        url: '/account/getBasicInfo',
        data: {'handle':tracker.handle},
        success: function(data){
            if(data.status == 0) {
                addUserToTable(data, tracker._id, (tracker.status == 1));
                updateStatusUI(tracker._id, (tracker.status == 1))
            }
            else if (data.status == -1) $('#handle-msg').html("Account not found");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function updateStatusUI(trackerId, isTracking) {
    var selector = '#' + trackerId
    var cell = $($(selector).children()[4]).children()[0]

    if(isTracking) {
        $(cell).removeClass('not-tracking')
        $(cell).removeClass('stopping')
        $(cell).addClass('tracking')
        $(cell).html('Tracking')
        $('#tracker #status').html('Status: <span class="badge badge-secondary tracking">Active</span>')
    } else {
        $(cell).removeClass('tracking')
        $(cell).removeClass('stopping')
        $(cell).addClass('not-tracking')
        $(cell).html('Not tracking')
        $('#tracker #status').html('Status: <span class="badge badge-secondary not-tracking">Stopped</span>')
    } 
}

function addUserToTable(data, trackerId, isTracking) {
    var deleteIcon
    if(isTracking) deleteIcon = '<i class="material-icons delete">remove_circle_outline</i>'
    else deleteIcon = '<i class="material-icons delete">delete_sweep</i>'
    var tableRow = '<tr id="' + trackerId + '">'
                + '<th scope="row">' + data.name + '</th>'
                + '<td>@' + data.handle + '</td>'
                + '<td>' + data.tweetCount + '</td>'
                + '<td>' + data.followersCount + '</td>'
                + '<td><span class="badge badge-secondary not-tracking">Not tracking</span></td>'
                + '<td>' + deleteIcon + '</td>'
                + '</tr>';
                var tableHTML = $('#overview-table-body').html();
                tableHTML += tableRow;
                $('#overview-table-body').html(tableHTML);
}

function isHandleValid(handle) {
    var specialCharReg =  /^[A-Za-z0-9_]{1,15}$/;

    if(handle.length == 0) {
        $('#handle-msg').html("Please enter a handle");
        return false;
    } if(handle.length > 15) {
        $('#handle-msg').html("Handle cannot be more than 15 characters long");
        return false;
    } else if (!specialCharReg.test(handle)){
        $('#handle-msg').html("Handles can only contain alphanumeric characters and underscores");
        return false;
    }

    $('#handle-msg').html('Click \'+\' to add account');
    return true;
 }