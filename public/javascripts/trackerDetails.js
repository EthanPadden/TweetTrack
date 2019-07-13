$("body").on('click', '#tracker-link-btn', function(){
    var handle = $('#tracker-link-btn')[0].getAttribute('handle')
    window.trackHandle = handle
    $(location).attr('href', '/tracker?handle=' + handle );
 });

 $(document).ready(setTitle)

 function setTitle() {
     var handle = document.cookie.split('handle=')[1]
    $('#analysis-section h4').html('Analysis - ' + handle)
 }