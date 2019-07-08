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

    
    // var results = calculateEngagement(data.tweetStream, user.followersCount);
    // var engagement = results.engagement;
    // var nthchild = parseInt(index) + 2;
    // var selector = '#engagementChart > div:nth-child(' + nthchild + ')';
    // var ctx = $(selector + ' #engmt-overview');
    // var detailedCtx = $(selector + ' #engmt-details');

    // var dataset = [engagement, 100-engagement];
    // new Chart(detailedCtx, {
    //     type: 'pie',
    //     data: {
    //       labels: ["Avg Likes","Avg Retweets"],

    //       datasets: [
    //         {
    //           backgroundColor: ['#FFE400', '#FF652F'],
    //           data: [results['avg-likes'], (results['avg-RTs']*10)]
    //         }
    //       ]
    //     },
    //     options: {
    //       title: {
    //         display: true,
    //         text: 'Contribution to metric'
    //       }
    //     }
    // });
    

    // var chartData = {
    //     datasets: [{
    //         // line label
    //         label: 'Engagement',
    //         // values to be plotted
    //         data: dataset,
    //         backgroundColor: [greenTheme, '#ffffff']
    //     }]
    // };


    // var myDoughnutChart = new Chart(ctx, {
    //     type: 'doughnut',
    //     data: chartData,
    //     // options: options
    // });
    // console.log(user);
    // $(selector + ' h4').html(user.name + ':\n' + Math.round(engagement) + '%');
    // if(index == 1) $('#engagementChart').removeClass('hidden');
}

function constructChart(stats, followers) {
    
}