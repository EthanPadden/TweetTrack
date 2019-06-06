var greenTheme = 'rgba(20, 167, 108, 1)';

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
                    addUserToTable(data);
                    makeCharts(data);
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

 function makeCharts(data) {
    // If this is the first chart being created
    if ($('#overview-table-body').children().length == 1) {
        var structureHTML = '<div class="row no-margin">'
        + '<div class="col"><canvas id="likesChart"></canvas></div>'
        + '<div class="col" style="background-color: green">B</div>'        
        + '<div class="col" style="background-color: blue">C</div>'
        + '</div>';

        $('#handle-input-group').after(structureHTML);
        createTweetChart(data);
    }

    createTweetChart(data);
 }

 function createTweetChart(data) {
    var ctx = $('#likesChart');

    var chartData = {
        // x axis labels
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            // line label
            label: '# of Votes',
            // values to be plotted
            data: [12, 19, 3, 5, 2, 3],
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
        // options: options
    });
 }


 /* 
 data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }

        */