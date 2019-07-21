$(document).ready(function() {
    // console.log("Compare")

})

var gStats = {
    'GameOfThrones':null,
    'HBO':null
}

function generateTweetEngmtChart(data, weights) {
    // FOR NOW: USING RTS ATTIBUTE INSTEAD OF AVG RTS
    var contrib_l = data.avg_likes*weights[0]
    var contrib_r = data.retweets*weights[1]
    var contrib_m = data.mentions*weights[2]
    var contrib_h = data.hashtags*weights[3]
    var contrib_o = data.other*weights[4]
    var ctx = $('#GameOfThronesCtx')
    console.log(weights)
    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ["Likes","Retweets", "Mentions", "HashTags", "Other"],

        datasets: [
            {
            backgroundColor: ['#FF652F', '#FFE400', '#14A76C', '#007BFF', '#747474'],
            data: [contrib_l, contrib_r, contrib_m, contrib_h, contrib_o]
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