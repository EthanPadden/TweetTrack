function addAccount (tracker) {
    // Gather basic account information from server
  $.ajax({
    type: 'GET',
    url: '/account/getBasicInfo',
    data: {'handle': tracker.handle},
    success: function (data) {
      if (data.status == 0) {
        addUserToTable(data, tracker._id, (tracker.status == 1))
        buildTracker(tracker)
      }
      else if (data.status == -1) $('#handle-msg').html('Account not found')
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  })
}

function addUserToTable (data, trackerId, isTracking) {
    // Create HTML for table row and append to account table
  var status = statusHTML(isTracking)
  var deleteIcon
  if (isTracking) deleteIcon = '<i class="material-icons delete">remove_circle_outline</i>'
  else deleteIcon = '<i class="material-icons delete">delete_sweep</i>'
  var tableRow = '<tr id="' + trackerId + '">'
    + '<th scope="row">' + data.name + '</th>'
    + '<td>@' + data.handle + '</td>'
    + '<td>' + data.tweetCount + '</td>'
    + '<td>' + data.followersCount + '</td>'
    + '<td>' + status + '</td>'
    + '<td>' + deleteIcon + '</td>'
    + '</tr>'
  var tableHTML = $('#overview-table-body').html()
  tableHTML += tableRow
  $('#overview-table-body').html(tableHTML)
}