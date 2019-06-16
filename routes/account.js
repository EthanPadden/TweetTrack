var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require('child_process').exec;
var fs = require('fs'); 

router.get('/getBasicInfo', function(req, res ,next){
   // Input data: { handle:string }
   exec('java -jar java/TweetTrack.jar overview ' + req.query.handle, function(err, stdout) {
    if(err) res.json({"status":-1});
    else {
        if(stdout) {
            var components = stdout.split('{');
            var outputString = '{' + components[components.length-1];
            var outputJSON = JSON.parse(outputString);
            outputJSON.status = 0;
            res.json(outputJSON);
        }
    }
});
    
});

router.get('/getTweetInfo', function(req, res, next){
    // Input data: { handle:string, count:int}
    

    exec('java -jar java/TweetTrack.jar tweetbytime ' + req.query.handle + ' ' + req.query.count + ' ' + 'java/statuslist.txt', function(err, stdout) {
    /* OUTPUT CODES:
    0 Success
    -1 Invalid input format
    1 Failed to get data for handle
    2 File not found to write data
    */
        if(stdout)  {
            // console.log("A::" + stdout + "::A");
            
            setTimeout(function () {
                fs.readFile('java/statuslist.txt', function(err, data) {
                    if(`${data}`.length == 0) {
                        console.log("Data is empty");
                        res.json({"status":-1});
                    } else {
                    var tweetArr = `${data}`.split('\n');
                    var jsonArr = [];
                    console.log("LEN: " + tweetArr.length);
                    for(var i = 0; i < tweetArr.length-1; i++) {
                        jsonArr[i] = JSON.parse(tweetArr[i]);
                    }
                    var outputJSON = {
                        'status':-1,
                        'tweetStream':jsonArr
                    };
                    
                    outputJSON.status = 0;
                    res.json(outputJSON);
                    }
                });
            }, 1000); 
               
            }
        
       
    });
  

   
    
});


router.get('/getTweetsByTime', function(req, res, next){
    
        // Input data: { handle:string, numDays:int}
        exec('java -jar java/TweetTrack.jar tweetbytime ' + req.query.handle + ' ' + req.query.numDays + ' ' + 'java/statuslist.txt', function(err, stdout) {
            /* OUTPUT CODES:
            0 Success
            -1 Invalid input format
            1 Failed to get data for handle
            2 File not found to write data
            */
           console.log("A");
                
                if(err) {
                    console.log("B");
        
                    res.json({"status":err.code});
                }
                else {
                    console.log("C");

                    if(stdout.indexOf('SUCCESS') != -1) {
                        console.log("D");
                    
                        fs.readFile('java/statuslist.txt', function(err, data) {
                            if(`${data}`.length == 0) {
                                console.log("Data is empty");
                                res.json({"status":-1});
                            } else {
                            var tweetArr = `${data}`.split('\n');
                            var jsonArr = [];
        
                            for(var i = 0; i < tweetArr.length; i++) {
                                jsonArr[i] = JSON.parse(tweetArr[i]);
                            }
                            console.log(jsonArr);
                            var outputJSON = {
                                'status':-1,
                                'tweetStream':jsonArr
                            };
                            
                            outputJSON.status = 0;
                            res.json(outputJSON);
                        }
                        });
                    } else if (stdout.indexOf('FAILURE') != -1) {
                    console.log("E");

                        console.log("CANNOT FIND FILE");
                        res.json({"status":-1});
                    }
                }
            });

});


module.exports = router;