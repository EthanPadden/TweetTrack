$('#graph-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#compare-tab').removeClass('active')
  $('#eg-tab').removeClass('active')
  $('#track-tab').removeClass('active')
  $('#tracker-section').addClass('hidden')
  $('#tracking-options').addClass('hidden')
  $('#eg-section').addClass('hidden')
  showGraphs()
})

$('#compare-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#graph-tab').removeClass('active')
  $('#track-tab').removeClass('active')
  $('#eg-tab').removeClass('active')
  $('#engagement-options').removeClass('hidden')
  $('#tracking-options').addClass('hidden')
  $('#tracker-section').addClass('hidden')
  $('#eg-section').addClass('hidden')
  hideGraphs()
})

$('#track-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#graph-tab').removeClass('active')
  $('#eg-tab').removeClass('active')
  $('#compare-tab').removeClass('active')
  $('#engagement-options').addClass('hidden')
  $('#engagementChart').addClass('hidden')
  $('#tracking-options').removeClass('hidden')
  $('#tracker-section').removeClass('hidden')
  $('#eg-section').addClass('hidden')
  hideGraphs()
})
$('#eg-tab').click(function (event) {
  $(event.target).addClass('active')
  $('#graph-tab').removeClass('active')
  $('#track-tab').removeClass('active')
  $('#compare-tab').removeClass('active')
  $('#engagement-options').addClass('hidden')
  $('#engagementChart').addClass('hidden')
  $('#tracking-options').addClass('hidden')
  $('#tracker-section').addClass('hidden')
  $('#eg-section').removeClass('hidden')
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
