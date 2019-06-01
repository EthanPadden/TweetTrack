var invalidHandleChars = ['{', '}'];


    

$('#add-account-btn').click(function(event){
    var handle = $('#handle-input').val();
    if (isHandleValid(handle)) {
        $.ajax({
            type: 'GET',
            url: '/account/getBasicInfo',
            data: {'handle':handle},
            success: function(data){
                console.log(data);
                var tableRow = '<tr>'
                + '<th scope="row">' + data.name + '</th>'
                + '<td>@' + data.handle + '</td>'
                + '<td>' + data.tweetCount + '</td>'
                + '<td>' + data.followersCount + '</td>'
                + '</tr>';
                var tableHTML = $('#overview-table-body').html();
                tableHTML += tableRow;
                $('#overview-table-body').html(tableHTML);
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    } else {
        var errMsg = "Please enter valid Twitter handle. Twitter handles must not contain the following characters: ";
        for(i in invalidHandleChars) {
            errMsg += invalidHandleChars[i] + ' ';
        }
        alert(errMsg);
    }
});

function isHandleValid(handle) {
    var i;
    for(i in invalidHandleChars) {
        if(handle.includes(invalidHandleChars[i])) return false;
    }

    return true;
 }