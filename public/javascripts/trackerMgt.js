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
        $('#handle-input').attr('data-original-title', 'Please enter a handle').tooltip('show');
        return false;
    } if(handle.length > 15) {
        $('#handle-input').attr('data-original-title', 'Handle cannot be more than 15 characters long').tooltip('show');
        return false;
    } else if (!specialCharReg.test(handle)){
        $('#handle-input').attr('data-original-title', 'Handles can only contain alphanumeric characters and underscores').tooltip('show');
        return false;
    }

    $('#handle-input').tooltip('hide');
    return true;
 }