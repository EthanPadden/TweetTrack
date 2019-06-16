var greenTheme = 'rgba(20, 167, 108, 1)';
var yellowTheme = 'rgba(255, 228, 0, 1)';
var defaultNumTweets = 30; // If increased too much, it exceeds the max buffer
var accounts = [];

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
                    accounts.push(data);
                    addUserToTable(data);
                    addGraphOptions();
                    updateGraphOptions(data);
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

$('#add-graph-btn').click(function(event){
    // Find the index of the selected option
    var index = $('#account-dropdown option:selected').index();
    var chartType = $("#chart-type-dropdown").val();

    // Find the handle of the selected account from array of data
    var handle = accounts[index].handle;

    $.ajax({
        type: 'GET',
        url: '/account/getTweetInfo',
        data: {'handle':handle, 'count':defaultNumTweets},
        success: function(data){
            if(data.status == 0) {
                if(chartType == 'Likes') createLikesChart(data, handle);
                else if(chartType == 'Retweets') createRTsChart(data, handle);
                
            }
            else if (data.status == -1) console.log("Error");
        },
        error: function(errMsg) {
            console.log(errMsg);
        }
    });
});

function createRTsChart(data, handle) {
    if($('#RTsChart').hasClass('hidden')) $('#RTsChart').removeClass('hidden');
    var ctx = $('#RTsChart canvas');
    
    // Dataset extracted from tweetStream
    var dataset = [];
    var labels = [];
    var i;
    for(i in data.tweetStream) {
        dataset.push(data.tweetStream[i].rt_count);
        labels.push(i);
    }
    var chartData = {
        labels: labels,
        datasets: [{
            // line label
            label: '# of Retweets',
            // values to be plotted
            data: dataset,
            // line options
            borderWidth: 1,
            borderColor: yellowTheme,
            fill: false,
            lineTension: 0
        }]
    };

    var RTsChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }]
            }
        }
    });

    // Get name of tracked user
    var username;
    for(i in accounts) if (accounts[i].handle == handle) username = accounts[i].name;
    $('#RTsChart h4').html("Retweets - " + username);

    var avgRts = findAvg(dataset);
    $('#avg-rts').html("Average retweets: " + avgRts);
    var maxRts = findMax(dataset);
    $('#max-rts').html("Max retweets: " + maxRts);
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

 function addGraphOptions() {
    if($('#graph-options').hasClass('hidden')) $('#graph-options').removeClass('hidden');
    if($('#nav-bar').hasClass('hidden')) $('#nav-bar').removeClass('hidden');
 }

 function updateGraphOptions(data) {
    var html = $('#account-dropdown').html() + '<option>' + data.name + '</option>';
    $('#account-dropdown').html(html);
 }

 // x axis labels
//  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],

 function createLikesChart(data, handle) {
    if($('#likesChart').hasClass('hidden')) $('#likesChart').removeClass('hidden');
    var ctx = $('#likesChart canvas');

    // Dataset extracted from tweetStream
    var dataset = [];
    var labels = [];
    var i;
    for(i in data.tweetStream) {
        dataset.push(data.tweetStream[i].favourite_count);
        labels.push(i);
    }
    var chartData = {
        labels: labels,
        datasets: [{
            // line label
            label: '# of Likes',
            // values to be plotted
            data: dataset,
            // line options
            borderWidth: 1,
            borderColor: greenTheme,
            fill: false,
            lineTension: 0
        }]
    };

    var likesChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }]
            }
        }
    });
    
    // Get name of tracked user
    var username;
    for(i in accounts) if (accounts[i].handle == handle) username = accounts[i].name;
    $('#likesChart h4').html("Likes - " + username);

    var avgLikes = findAvg(dataset);
    $('#avg-likes').html("Average likes: " + avgLikes);
    var maxLikes = findMax(dataset);
    $('#max-likes').html("Max likes: " + maxLikes);
 }

 function findAvg(dataset) {
     var total = 0;
     var i;
     for(i in dataset) {
         total += dataset[i]
     }

     return Math.round(total/dataset.length);
 }

 function findMax(dataset) {
     var max = 0;
     var i;
     for(i in dataset) {
         if(dataset[i] > max) max = dataset[i];
      }

      return max;
 }

 $('#graph-tab').click(function(event){
    $(event.target).addClass('active');
    $('#compare-tab').removeClass('active');
    showGraphs();
});
 $('#compare-tab').click(function(event){
    $(event.target).addClass('active');
    $('#graph-tab').removeClass('active');
    hideGraphs();

});

function hideGraphs() {
    $('#likesChart').addClass('hidden');
    $('#RTsChart').addClass('hidden');
    $('#graph-options').addClass('hidden');
    $('#engagement-options').removeClass('hidden');
}
function showGraphs() {
    $('#graph-options').removeClass('hidden');
    $('#engagement-options').addClass('hidden');

    

if ( $('#likesChart canvas').hasClass('chartjs-render-monitor'))   $('#likesChart').removeClass('hidden');
if ( $('#RTsChart canvas').hasClass('chartjs-render-monitor'))   $('#RTsChart').removeClass('hidden');


}

$('#add-metrics-btn').click(function(event){
    var span = $('#span-input').val();
    var spanType = $("#span-dropdown").val();

    if (isNaN(span)) alert("Number of days/tweets should be a number");
    else {
        if (spanType == "Tweets") {
            $.ajax({
                type: 'GET',
                url: '/account/getTweetInfo',
                data: {'handle':accounts[0].handle, 'count':span},
                success: function(data){
                    if(data.status == 0) {
                        displayEngagementChart(accounts[0], data);
                    }
                    else if (data.status == -1) alert("Error");
                },
                error: function(errMsg) {
                    console.log(errMsg);
                }
            });
        }
        else if (spanType == "Days") {
            $.ajax({
                type: 'GET',
                url: '/account/getTweetsByTime',
                data: {'handle':accounts[0].handle, 'numDays':span},
                success: function(data){
                    if(data.status == 0) {
                       console.log(data);
                    }
                    else if (data.status == -1) alert("Error");
                },
                error: function(errMsg) {
                    console.log(errMsg);
                }
            });
        }
    }
        
});

function displayEngagementChart(user, data) {
    var engagement = calculateEngagement(data.tweetStream, user.followersCount);
    console.log(engagement);
    var ctx = $('#engagementChart canvas');
    var dataset = [engagement, 100-engagement];

    var chartData = {
        datasets: [{
            // line label
            label: 'Engagement',
            // values to be plotted
            data: dataset,
        }]
    };

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        // options: options
    });
    $('#engagementChart').removeClass('hidden');
}

function calculateEngagement(tweets, f) {
    var l = 0;
    var r = 0;
    var t = tweets.length;
    for(var i in tweets) {
        l += tweets[i].favourite_count;
        r += tweets[i].rt_count;
    }

    var egmt = (100/(f*t))*((l*100)+(r*1000));

    return egmt;
}
/*

// Dataset extracted from tweetStream
var dataset = [];
var labels = [];
var i;
for(i in data.tweetStream) {
    dataset.push(data.tweetStream[i].favourite_count);
    labels.push(i);
}
var chartData = {
    labels: labels,
    datasets: [{
        // line label
        label: '# of Likes',
        // values to be plotted
        data: dataset,
        // line options
        borderWidth: 1,
        borderColor: greenTheme,
        fill: false,
        lineTension: 0
    }]
};

var likesChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                display: false //this will remove all the x-axis grid lines
            }]
        }
    }
});*/