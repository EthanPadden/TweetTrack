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
    console.log(isHandleValid(handle));
});

function isHandleValid(handle) {
    var i;
    for(i in invalidHandleChars) {
        if(handle.includes(invalidHandleChars[i])) return false;
    }

    return true;
 }