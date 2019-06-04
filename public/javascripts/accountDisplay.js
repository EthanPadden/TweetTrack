$('#handle-input').keyup(function(event){
    var handle = event.target.value;
    isHandleValid(handle);
});
$('#add-account-btn').click(function(event){
    var handle = $('#handle-input').val();
    if (isHandleValid(handle)) {
        console.log("Yes");
    //     // $.ajax({
    //     //     type: 'GET',
    //     //     url: '/account/getBasicInfo',
    //     //     data: {'handle':handle},
    //     //     success: function(data){
    //     //         console.log(data);
    //     //         var tableRow = '<tr>'
    //     //         + '<th scope="row">' + data.name + '</th>'
    //     //         + '<td>@' + data.handle + '</td>'
    //     //         + '<td>' + data.tweetCount + '</td>'
    //     //         + '<td>' + data.followersCount + '</td>'
    //     //         + '</tr>';
    //     //         var tableHTML = $('#overview-table-body').html();
    //     //         tableHTML += tableRow;
    //     //         $('#overview-table-body').html(tableHTML);
    //     //     },
    //     //     error: function(errMsg) {
    //     //         console.log(errMsg);
    //     //     }
    //     // });
    } else {
    //     // var errMsg = "Please enter valid Twitter handle. Twitter handles must not contain the following characters: ";
    //     // for(i in invalidHandleChars) {
    //     //     errMsg += invalidHandleChars[i] + ' ';
    //     // }
    //     // alert(errMsg);
    //     console.log("No");
    }
    // isHandleValid(handle);
});

var reg = /a/;
// var reg1 = new Regex('a');



function isHandleValid(handle) {
    var specialCharReg =  /^[A-Za-z0-9_]{1,15}$/;

    if(handle.length == 0) {
        console.log("Please enter a handle");
        return false;
    } if(handle.length > 15) {
        console.log("Handle cannot be more than 15 characters long");
        return false;
    } else if (!specialCharReg.test(handle)){
        console.log("Handles can only contain alphanumeric characters and underscores");
        return false;
    }

    return true;
 }