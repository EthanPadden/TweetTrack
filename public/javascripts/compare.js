$(document).ready(function() {
    // console.log("Compare")

})

var gStats = {
    'GameOfThrones':null,
    'HBO':null
}

function generateTweetEngmtChart(data) {
    var ctx = $('#GameOfThronesCtx')
    console.log(data)
    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ["Likes","Retweets", "Mentions", "HashTags", "Other"],

        datasets: [
            {
            backgroundColor: ['#FF652F', '#FFE400', '#14A76C', '#007BFF', '#747474'],
            data: [data.avg_likes, data.avg_rts, data.mentions, data.hashtags, data.other]
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
}