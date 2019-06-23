$('#graph-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#compare-tab').removeClass('active')
  $('#track-tab').removeClass('active')
  $('#tracker').addClass('hidden')
  showGraphs()
})

$('#compare-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#graph-tab').removeClass('active')
  $('#track-tab').removeClass('active')
  $('#engagement-options').removeClass('hidden')
  $('#tracker').addClass('hidden')
  hideGraphs()
})

$('#track-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#graph-tab').removeClass('active')
  $('#compare-tab').removeClass('active')
  $('#engagement-options').addClass('hidden')
  $('#tracker').removeClass('hidden')
  hideGraphs()
})

function hideGraphs () {
  $('#likesChart').addClass('hidden')
  $('#RTsChart').addClass('hidden')
  $('#graph-options').addClass('hidden')
}

function showGraphs () {
  $('#graph-options').removeClass('hidden')
  $('#engagement-options').addClass('hidden')
  if ($('#likesChart canvas').hasClass('chartjs-render-monitor'))   $('#likesChart').removeClass('hidden')
  if ($('#RTsChart canvas').hasClass('chartjs-render-monitor'))   $('#RTsChart').removeClass('hidden')
}
