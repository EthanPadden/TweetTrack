//Sample

function trackerEngmtChart(stats, handle) {
    // Get the followers count of the handle:
    $.ajax({
        type: 'GET',
        url: '/account/getBasicInfo',
        data: {'handle':handle},
        success: function(data){
            if(data.status == 0) {
                constructChart(stats, data.followersCount)
            }
            else if (data.status == -1) alert('Account not found for tracking')
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
}

function constructChart(stats, followers) {
    var results = calculateEngagementFromStats(stats, followers)
    var engagement = results.engagement
    var mentions = stats.mentions_count

    console.log("RES: " + results.avg_rts)
    console.log("STATS: " + stats)

    var ctx = $('#tracker #engmt-chart')

    // var dataset = [engagement, 100-engagement];

    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ["Avg Likes","Avg Retweets", "Mentions"],

        datasets: [
            {
            backgroundColor: ['#FFE400', '#FF652F', '#14A76C'],
            data: [(100*results['avg_likes']), (results['avg_rts']*1000), mentions]
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Contribution to metric'
        }
        }
    });

    calculatedStats = {
        'avg_likes':results.avg_likes,
        'avg_rts':results.avg_likes,
        'mentions':mentions
    }
    displayStats(calculatedStats)
}

function displayStats(stats) {
    
}