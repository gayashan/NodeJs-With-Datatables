
var express = require('express');

ROOT_PATH = __dirname;

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

var router = require('./src/view/router');
var fs = require('fs');
 
var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});

app.configure(function(){
	app.use(express.logger({stream: expressLogFile}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
	app.use(app.router);
	app.use(express.errorHandler());
	app.use(express.static( __dirname + '/public'));

});

app.set('env', 'production');
	
var http = require('http').createServer(app);
 
function start(config, db) {
	var handlers = {		
		data: require('./src/controller/dataHandler').load(db)				
	};
	
	router.setup(app, handlers);
	var port = process.env.PORT || config.nodeServer.port;
	app.listen(port, process.env.HOST || '0.0.0.0' );
	http.listen(3000,'localhost');	
	console.log("Express server listening on port %d in %s mode", port, app.settings.env, app.address );
}
// *******************************************************
exports.start = start;
exports.app = app;