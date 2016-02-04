var express = require( 'express' );
//var logfmt = require( 'logfmt' );
var contextHandler = require( './lib/context-handler' );
var pageHandler = require( './lib/page-handler' );
var formHandler = require( './lib/form-handler' );
var resourceHandler = require( './lib/resource-handler' );
var hbs = require( 'hbs' );
var app = express();
var fs = require( 'fs' );
var cwd = process.cwd();
var path = require( 'path' );
var paths = {
    NotFound: path.join( cwd, '/sites/404.html' ),
    Error: path.join( cwd, '/sites/500.html' )
};

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// serve application UI
app.use( '/', function( req, res, next ){
	fs.realpath( path.join( cwd, req.path ), function( err, path ){
		if ( err ) {
			res.status( 404 ).sendFile( paths.NotFound );
            return;
		}

		res.sendFile( path, function( err ){
            if ( err ) {
                res.status( 404 ).sendFile( paths.NotFound );
                return;
            }
        });
	});
});

var port = Number( process.env.PORT || 5000 );

app.listen( port, function() {
	console.log( 'Listening on ' + port );
});
