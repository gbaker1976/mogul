var express = require( 'express' );
var html = require( './lib/html-engine' );
var app = express();
var port = Number( process.env.PORT || 5000 );

app.engine( 'html', html );
app.set( 'view engine', 'html' );
app.use( express.static( 'dist' ) );
app.use( express.static( 'bower_components' ) );

app.get( '/', function( req, res, next ){
    res.render( 'index' );
});

app.listen( port, function() {
	console.log( 'Mogul App listening on port: %d', port );
});
