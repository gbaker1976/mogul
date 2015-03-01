var express = require( 'express' );
//var logfmt = require( 'logfmt' );
var contextHandler = require( './lib/context-handler' );
var pageHandler = require( './lib/page-handler' );
var formHandler = require( './lib/form-handler' );
var resourceHandler = require( './lib/resource-handler' );
var hbs = require( 'hbs' );
var app = express();
var fs = require( 'fs' );

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// serve application UI
app.use( '/', function( req, res, next ){
	fs.realpath( '.' + req.path, function( err, path ){
		if ( err ) {
			console.log( req.path );
			res.send( 'Not found', 400 );
			return false;
		}
		res.sendfile( path );
	});
	return false;
});

var port = Number( process.env.PORT || 5000 );

app.listen( port, function() {
	console.log( 'Listening on ' + port );
});
