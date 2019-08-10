$(document).ready(function () {
  var options = {
    trigger: 'manual'
  }
  $('#handle-input').tooltip(options)
})

$('#handle-input').keyup(function (event) {
  var handle = event.target.value
  isHandleValid(handle)
})

$('body').on('click', '#account-table i.delete', function (e) {
  var parentRow = $(e.target).parents()[1]
  var trackingStatusCell = $(parentRow).children()[4]
  var trackingStatus = $($(trackingStatusCell).children()[0]).html()
  if (trackingStatus == 'Tracking') deleteOptions(true, parentRow.id)
  else if (trackingStatus == 'Not tracking') deleteOptions(false, parentRow.id)
})

$('body').on('click', '#stop-track-btn', function (e) {
  var handle = $(e.target).attr('handle')
  
})

$('body').on('mouseenter', '#account-table i.delete', function (e) {
  $(e.target).css('cursor', 'pointer')
})

function deleteOptions (isTracking, trackerId) {
  if (isTracking) {
    swal({
      title: 'Stop tracker?',
      text: 'This tracker is currently tracking. Do you want to stop it?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          stopTracker(trackerId)
        }
      })
  } else {
    swal({
      title: 'Delete tracked information?',
      text: 'This information cannot be recovered once deleted. Are you sure?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          swal('The tracked information has been deleted',
            {icon: 'success'}
          )
        }
      })
  }
}

function stopTracker (trackerId) {
  $.ajax({
    type: 'GET',
    url: '/track/stopTracker',
    data: {'tracker_id': trackerId},
    success: function (data) {
      if (data.status == 0) {
        swal({
          title: 'Tracker has been stopped',
          text: 'You can still view the tracked information',
          icon: 'success'
        })
      } else if (data.status == 1) { // Problem with finding tracker in DB
        swal({
          title: 'Error',
          text: 'There was a problem with stopping the tracker',
          icon: 'error'
        })
      }
    },
    error: function (errMsg) {
      swal({
        title: 'Error',
        text: 'There was a problem with stopping the tracker',
        icon: 'error'
      })
    }
  })
}

$('#add-account-btn').click(function (event) {
  var handle = $('#handle-input').val()
  if (isHandleValid(handle)) {
    $.ajax({
      type: 'GET',
      url: '/track/trackUser',
      data: {'handle': handle},
      success: function (data) {
        if (data.status == 0) {
          swal({text: 'Tracker set up',icon: 'success'})
        } else if (data.status == -1) { // Problem with Java process
          handleErr(data.err.trim())
        } else if (data.status == 1) { // Problem with finding tracker in DB
          handleErr('SIG_DB_CLIENT')
        }
      },
      error: function (errMsg) {
        console.log(errMsg)
      }
    })
  }
})

function handleErr (signal) {
  var msg
  switch (signal) {
    case 'SIG_CMD_ERR_0':
    case 'SIG_CMD_ERR_1':
      msg = 'There was an error with the input arguments to the Java code'
      break
    case 'SIG_ACCT_ERR_0':
      msg = 'There was an error when trying to access the Twitter API'
      break
    case 'SIG_ACCT_ERR_1':
      console.log(signal)
      msg = 'Account not found'
      break
    case 'SIG_DB_ERR_0':
    case 'SIG_DB_ERR_1':
      msg = 'There was an authentication problem when trying to access the database'
      break
    case 'SIG_DB_CLIENT':
      msg = 'There was a problem setting up the tracker in the database'
      break
    default:
      msg = 'The server returned an error message that was not recognised'
      break
  }

  swal({
    title: 'Error',
    text: msg,
    icon: 'warning'
  })
}

function isHandleValid (handle) {
  var specialCharReg = /^[A-Za-z0-9_]{1,15}$/
  if (handle.length == 0) {
    $('#handle-input').attr('data-original-title', 'Please enter a handle').tooltip('show')
    return false
  } if (handle.length > 15) {
    $('#handle-input').attr('data-original-title', 'Handle cannot be more than 15 characters long').tooltip('show')
    return false
  } else if (!specialCharReg.test(handle)) {
    $('#handle-input').attr('data-original-title', 'Handles can only contain alphanumeric characters and underscores').tooltip('show')
    return false
  }

  $('#handle-input').tooltip('hide')
  return true
}
