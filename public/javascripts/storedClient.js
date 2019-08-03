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
                    addTweetToTable(data.stats[i])
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
     var date = new Date(data.created_at).toString().split(' GMT')[0]
    var tableRow = '<tr id="' + data._id + '">'
                + '<td>' + data.text.slice(0,40) + '...</td>'
                + '<td>' + date + '</td>'
                + '<td>' + data.favourite_count + '</td>'
                + '<td>' + data.rt_count + '</td>'
                + '<td class="hidden">' + data.text + '</td>'
                + '<td class="hidden">' + data.is_rt + '</td>'
                + '<td class="hidden">' + data.stats.before_mentions + '</td>'
                + '<td class="hidden">' + data.stats.after_mentions + '</td>'
                + '<td class="hidden">' + data.stats.before_hashtags + '</td>'
                + '<td class="hidden">' + data.stats.after_hashtags + '</td>'
                + '<td class="hidden">' + data.stats.before_other + '</td>'
                + '<td class="hidden">' + data.stats.after_other + '</td>'
                

    for(var i in data.url_entities) {
        var html = '<td class="hidden">' + data.url_entities[i] + '</td>'
        tableRow += html
    }

    for(var i in data.media_entities) {
        var html = '<td class="hidden">' + data.media_entities[i].type + ';' + data.media_entities[i].url + '</td>'
        tableRow += html
    }
                
    tableRow += '</tr>'
    $('#tweet-table-body').append(tableRow);
}