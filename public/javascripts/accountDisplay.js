var tableRowHTML = [
    "<tr>",
    "<th scope='row'>",
    "</th>",
    "<td>",
    "</td>",
    "</tr>"
];

var invalidHandleChars = ['{', '}'];

// {{!-- <tr>
//     <th scope="row">Donald J. Trump</th>
//     <td>@realDonaldTrump</td>
//     <td>42.1K</td>
//     <td>60.6M</td>
//   </tr> --}}

$('#add-account-btn').click(function(event){
    var handle = $('#handle-input').val();
    if (isHandleValid(handle)) {

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