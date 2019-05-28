// //This is a test
// var exec = require('child_process').exec;

// exec("ls", function(err, stdout){
//     // console.log("Hello world");
//     if(err) throw err;
//     else console.log(stdout);
// });
// console.log("Hello world");

var exec = require('child_process').exec;

exec('java -jar sumOfProject.jar', function(err, stdout) {
    console.log(stdout);
});