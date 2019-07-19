var weightInputs = ['wL', 'wR', 'wM', 'wH', 'wO']

$('#calc-w-btn').click(function(){
    var weights = []
    for(var i in weightInputs){
        var w = $('#' + weightInputs[i]).val()
        if(isNaN(w) || w.length == 0) alert("Weight must be a number")
        else weights.push(parseFloat(w))
    }

    if(weights.length == 5) {
        // Check if stats are stored in browser - if not, make ajax request
        // Calc stats from weights
    }
})