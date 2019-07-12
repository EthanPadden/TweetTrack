$("body").on('click', '#tracker-link-btn', function(){
    var handle = $('#tracker-link-btn')[0].getAttribute('handle')
    window.trackHandle = handle
    window.location.href = "/tracker";
 });
