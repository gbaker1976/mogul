var express = require( 'express' );
//var logfmt = require( 'logfmt' );
var contextHandler = require( 'context-handler' );
var pageHandler = require( 'page-handler' );
var hbs = require( 'hbs' );
var app = express();
var fs = require( 'fs' );
var path = require( 'path' );
var cache = require( 'cache' );

app.set( 'views', process.cwd() + '/' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// cache.get( 'test-data', function( err, value, key ){
//     if ( !value ) {
//         fs.readFile( path.join( process.cwd(), 'data.json' ), 'utf-8', function( err, contents ){
//             if ( err ) {
//                 console.log( 'unable to read test data file' );
//                 return;
//             }
//
//             if ( contents ) {
//                 cache.set( 'test-data', contents );
//             }
//         });
//     }
// });

app.use( contextHandler );
app.use( pageHandler );

var port = Number( process.env.PORT || 5000 );

app.listen( port, function() {
	console.log( 'Listening on ' + port );
});
