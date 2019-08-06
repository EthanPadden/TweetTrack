$(document).ready(function() {
    var options = {
        trigger:'manual'
    }
    $('#handle-input').tooltip(options)

})

$('#handle-input').keyup(function(event){
    var handle = event.target.value;
    isHandleValid(handle);
});

$('#add-account-btn').click(function(event){
    var handle = $('#handle-input').val();
    if (isHandleValid(handle)) {
        alert("Tracker created")
    } 
});

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

    $('#handle-input').tooltip('show');
    return true;
 }