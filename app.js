var express = require( 'express' );
//var logfmt = require( 'logfmt' );
var contextHandler = require( './lib/context-handler' );
var pageHandler = require( './lib/page-handler' );
var hbs = require( 'hbs' );
var app = express();
var fs = require( 'fs' );

app.set( 'views', process.cwd() + '/' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

app.use( contextHandler );
app.use( pageHandler );

var port = Number( process.env.PORT || 5000 );

app.listen( port, function() {
	console.log( 'Listening on ' + port );
});
