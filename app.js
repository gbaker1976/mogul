var express = require( 'express' );
var logfmt = require( 'logfmt' );
var hbs = require( 'hbs' );
var app = express();

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

app.use( logfmt.requestLogger() );
app.use( function( req, res, next ){
	req.site = {
		templatePath: 'sweet_october/templates',
		resourcePath: 'sweet_october/resources'
	};

	next();
});

// serve up resources for a given site
app.get( /^\/js|css|images/, function( req, res, next ) {
	var path = __dirname + '/sites/' + req.site.resourcePath + req.path;
	res.sendfile( path );
});

// serve up pages for a given site (GET)
app.get( /^\/|.*\.html$/, function( req, res ) {
	if ( '/' === req.path ) {
		req.path = '/index';
	}
	
	res.render( req.site.templatePath + req.path );
});

app.use( function( req, res ) {
	res.status( 404 );
	res.render( 
			'404', 
			{
				title: '404: Not Found'
			} 
	);
});

app.use( function( err, req, res ) {
	res.status( 500 );
	res.render( 
			'500', 
			{
				title: '500: Oops...'
			} 
	);
});

var port = Number( process.env.PORT || 5000 );
app.listen( port, function() {
	console.log( 'Listening on ' + port );
});