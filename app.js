var express = require( 'express' );
var logfmt = require( 'logfmt' );
var contextHandler = require( './lib/context-handler' );
var pageHandler = require( './lib/page-handler' );
var formHandler = require( './lib/form-handler' );
var resourceHandler = require( './lib/resource-handler' );
var hbs = require( 'hbs' );
var app = express();

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// log all requests
app.use( logfmt.requestLogger() );

// establish account context
app.use( contextHandler );

//handle form posts
app.use( '/form/:formId', formHandler );

// serve static content
app.use( '/js', resourceHandler );
app.use( '/css', resourceHandler );
app.use( '/images', resourceHandler );

// handle dynamic pages
app.get( /.*/, pageHandler );

// handle 404
app.use( function( req, res ) {
	res.status( 404 );
	res.render( 
			req.site.id + '/templates/404.html',
			{
				title: '404: Not Found',
				content: '<h1>Not found...</h1>'
			} 
	);
});

// handle 500
app.use( function( err, req, res ) {
	res.status( 500 );
	res.render( 
			req.site.id + '/templates/500.html', 
			{
				title: '500: Error',
				content: '<h1>Oops...</h1>'
			} 
	);
});

var port = Number( process.env.PORT || 5000 );	
	
app.listen( port, function() {
	console.log( 'Listening on ' + port );
});