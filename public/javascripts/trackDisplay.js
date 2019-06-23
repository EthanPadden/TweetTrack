/* Default call for past week
Get todays date
Get day of week => get mondays date
Make ajax request for that date
*/
var started = false
$('#track-tab').click(function (event) {
  if (!started) {
    started = true
    var d = new Date()

    var dates = getMonday(d)
    console.log(dates);
    
   
    if(window.accounts.length < 2) alert("You must add 2 accounts to track");
    else if (window.accounts.length == 2) {
        $.ajax({
          type: 'GET',
          url: '/track/getTweetsByWeek',
          data: {'handle':accounts[0].handle, 'start_date':prevMonday, 'end_date':end_date},
          success: function(data){
              console.log(data)
          },
          error: function(errMsg) {
              console.log(errMsg);
          }
      });
    }
  
  }
})

// function getPreviousMonday () {
//   var date = new Date()
//   var day = date.getDay()
//   var prevMonday
//   if (date.getDay() == 0) {
//     prevMonday = new Date().setDate(date.getDate() - 7)
//   } else {
//     prevMonday = new Date().setDate(date.getDate() - day)
//   }

//   var prevMondayDate = new Date(prevMonday)
//   console.log(prevMondayDate.toString())
//   var d = prevMonday.getDate().toString()
//   if (d.length == 1) num = '0' + num
//   var m = prevMonday.getMonth().toString()
//   if (m.length == 1) num = '0' + num
//   return d + '/' + m + '/' + date.getFullYear()
// }

function getMonday(d)
{
    var prevMonday =  new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() - 6) // -7+1
    var d = prevMonday.getDate().toString()
    if (d.length == 1) d = '0' + d
    var m = (prevMonday.getMonth()+1).toString()
    if (m.length == 1) m = '0' + m

    var startDate = d + '/' + m + '/' + prevMonday.getFullYear().toString()
    
    var nextMonday = prevMonday;
    nextMonday.setDate(prevMonday
      .getDate() + 7);

      // If next Monday is in the future
      var today = new Date();
      if(nextMonday.getTime() > today.getTime()) nextMonday = today;

      var d = nextMonday.getDate().toString()
      if (d.length == 1) d = '0' + d
      var m = (nextMonday.getMonth()+1).toString()
      if (m.length == 1) m = '0' + m
      var endDate = d + '/' + m + '/' + nextMonday.getFullYear().toString()
      return [startDate, endDate];
} 
