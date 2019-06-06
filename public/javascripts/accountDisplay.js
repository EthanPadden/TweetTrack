$('#handle-input').keyup(function(event){
    var handle = event.target.value;
    isHandleValid(handle);
});
$('#add-account-btn').click(function(event){
    var handle = $('#handle-input').val();
    if (isHandleValid(handle)) {
        $.ajax({
            type: 'GET',
            url: '/account/getBasicInfo',
            data: {'handle':handle},
            success: function(data){
                if(data.status == 0) {
                    addUserToTable(data);
                    makeCharts(data);
                }
                else if (data.status == -1) $('#handle-msg').html("Account not found");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    } 
});

function addUserToTable(data) {
    var tableRow = '<tr>'
                + '<th scope="row">' + data.name + '</th>'
                + '<td>@' + data.handle + '</td>'
                + '<td>' + data.tweetCount + '</td>'
                + '<td>' + data.followersCount + '</td>'
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

 function makeCharts(data) {
    // If this is the first chart being created
    if ($('#overview-table-body').children().length == 1) {
        var structureHTML = '<div class="row no-margin">'
        + '<div class="col" style="background-color: red">A</div>'
        + '<div class="col" style="background-color: green">B</div>'        
        + '<div class="col" style="background-color: blue">C</div>'
        + '</div>';

        $('#handle-input-group').after(structureHTML);
    }

    createTweetChart(data);
 }

 function createTweetChart(data) {
    
 }