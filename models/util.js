var mongoose = require('mongoose');
var creds = require('dbCreds')
var connection = mongoose.connect('mongodb://' + creds.user_name + ':' + creds.psw + '@' + creds.host + ':' + creds.port + '/' + creds.db, { useNewUrlParser: true });

exports.connection = connection;