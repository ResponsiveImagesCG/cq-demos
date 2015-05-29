(function() {
	var http = require('http'),
		finalhandler = require('finalhandler'),
		serveStatic = require('serve-static'),
		serve = serveStatic("./");

	var server = http.createServer(function(req, res){
	  var done = finalhandler(req, res);
	  serve(req, res, done);
	});
	server.listen(7777);

	console.log( "Listening on http://localhost:7777" );
	console.log( "Document root is " + __dirname );
	console.log( "Press Ctrl-C to quit." );
}());