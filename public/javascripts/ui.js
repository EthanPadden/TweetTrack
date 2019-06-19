//This

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