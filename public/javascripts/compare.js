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

function generateAccountEngmtChart() {
    var ctx = $('#engagement-chart-section canvas')[0]

    $('#engagement-chart-section').removeClass('hidden')
    var engmts = gatherTweetEngmtData()
    if(engmts != null) console.log(engmts)
    else console.log("NULL init")

    // new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //       labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    //       datasets: [{ 
    //           data: [86,114,106,106,107,111,133,221,783,2478],
    //           label: "Africa",
    //           borderColor: "#3e95cd",
    //           fill: false
    //         }, { 
    //           data: [282,350,411,502,635,809,947,1402,3700,5267],
    //           label: "Asia",
    //           borderColor: "#8e5ea2",
    //           fill: false
    //         }, { 
    //           data: [168,170,178,190,203,276,408,547,675,734],
    //           label: "Europe",
    //           borderColor: "#3cba9f",
    //           fill: false
    //         }, { 
    //           data: [40,20,10,16,24,38,74,167,508,784],
    //           label: "Latin America",
    //           borderColor: "#e8c3b9",
    //           fill: false
    //         }, { 
    //           data: [6,3,2,2,7,26,82,172,312,433],
    //           label: "North America",
    //           borderColor: "#c45850",
    //           fill: false
    //         }
    //       ]
    //     },
    //     options: {
    //       title: {
    //         display: true,
    //         text: 'World population per region (in millions)'
    //       }
    //     }
    //   });
      
}


function gatherTweetEngmtData() {
    var engmts = []

    var tableBody = $('#GOT-table tbody')[0]
    var rows = $(tableBody).children()
    var i = 0
    var lim = rows.length
    for (i = 0; i < lim; i++) {
      if (rows[i].childElementCount == 7) {
        var eCell = $(rows[i]).children()[1]
        engmts.push(parseInt($(eCell).html()))
      } else {
          if(engmts.length > 0) return engmts
          else return null
      }
    }
}
