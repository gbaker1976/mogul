var express = require( 'express' );
var html = require( './lib/html-engine' );
var resourceLoader = require( './lib/resource-loader' );
var app = express();
var port = Number( process.env.PORT || 5000 );

app.engine( 'html', html );
app.set( 'view engine', 'html' );
app.use( express.static( 'src' ));

app.get( '/', function( req, res, next ){
    res.render( 'index' );
});

app.get( '/*.html', function( req, res, next ){
    res.render( req.params[0] );
});

app.use( '/resources', resourceLoader );

app.listen( port, function() {
	console.log( 'Mogul App listening on port: %d', port );
});
