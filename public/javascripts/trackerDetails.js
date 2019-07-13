$("body").on('click', '#tracker-link-btn', function(){
    var handle = $('#tracker-link-btn')[0].getAttribute('handle')
    window.trackHandle = handle
    $(location).attr('href', '/tracker?handle=' + handle );
 });

 $(document).ready(function(){
    var handle = document.cookie.split('handle=')[1]

     setTitle(handle)
     gatherTweets(handle)
 })

 function setTitle(handle) {
    $('#analysis-section h4').html('Analysis - ' + handle)
 }

 function gatherTweets(handle) {
    $.ajax({
        type: 'GET',
        url: '/track/getTweets',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                for(var i in data.tweets) {
                    addTweetToTable(data.tweets[i])
                }

                calculateEngagement(0)
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
                + '<td>' + data.created_at.split(' IST')[0] + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td>Calculating...</td>'
                + '</tr>';
                var tableHTML = $('#tweet-table-body').html();
                tableHTML += tableRow;
                $('#tweet-table-body').html(tableHTML);
}

function calculateEngagement(i) {
    if(i >= $('#tweet-table-body').children().length) return
    else {
        var id = $('#tweet-table-body').children()[0].id
        $.ajax({
            type: 'GET',
            url: '/track/tweetEngmt',
            data: {'_id':id},
            success: function(data){
                if(data.status == 0) {
                    console.log(data)
                    // calculateEngagement(0)
                }
                else if (data.status == -1) console.log("Error");
            },
            error: function(errMsg) {
                console.log(errMsg);
            }
        });
    }
}