var config = require('./config');
var winston = require('winston');

var mongo = require('mongoskin');

var server = require('./server');
console.log("starting logger...");

winston.add(winston.transports.File, {
	filename: config.logger.api
});
// We will log all uncaught exceptions into exceptions.log
winston.handleExceptions(new winston.transports.File({
	filename: config.logger.exception
}));

console.log("logger started. Connecting to MongoDB...");
var dbConfig =  config.dbProduction;
//var dbConfig =  config.dbLocal; 

var db = mongo.db('mongodb://'+ dbConfig.mongo.url +'/' + dbConfig.mongo.database , {safe:true});
db.toObjectId = mongo.ObjectID.createFromHexString;
db.bind('person');

console.log("Successfully connected to MongoDB. Starting web server...");
server.start(config, db );

console.log("Successfully started web server. Waiting for incoming connections...");
console.log("file path: " + __dirname);

