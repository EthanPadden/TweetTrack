var mongoose = require('mongoose');
require('dotenv').config();
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;

var connection = mongoose.connect('mongodb+srv://' + dbUsername + ':' + dbPassword + '@' + dbCluster + '.yrvmfzg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
exports.connection = connection;