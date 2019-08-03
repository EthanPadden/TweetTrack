$(document).ready(function() {
    var handle = document.cookie.split('handle=')[1]
    gatherTweets(handle)
    setName(handle)
})

function setName(handle) {
    $.ajax({
        type: 'GET',
        url: '/account/getBasicInfo',
        data: {'handle':handle},
        success: function(data){
           $('#analysis-section h4').html('Analysis - ' + data.name)
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}



function gatherTweets(handle) {
    $.ajax({
        type: 'GET',
        url: '/store/getStats',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                for(var i in data.stats) {
                    console.log(data.stats[i])
                }

            }
            else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
 }


 function addTweetToTable(data) {
   
    var tableRow = '<tr id="' + data._id + '">'
                + '<td>' + data.text.slice(0,40) + '...</td>'
                // + '<td>' + data.text + '...</td>'
                + '<td>' + data.created_at.split(' IST')[0] + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td>Calculating...</td>'
                + '</tr>';
                var tableHTML = $('#tweet-table-body').html();
                tableHTML += tableRow;
                $('#tweet-table-body').html(tableHTML);
}