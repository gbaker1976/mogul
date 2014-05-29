var express = require( 'express' );
var logfmt = require( 'logfmt' );
var hbs = require( 'hbs' );
var app = express();

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// 1. log all requests
app.use( logfmt.requestLogger() );

// 2. establish account context
app.use( function( req, res, next ){
	req.site = {
		id: 'sweet_october',
		pages: {
			'/' : {
				type: 'page',
				template: 'index.html',
				data: {
					title: 'Main',
					content: '<h1>Main</h1>',
					quote: {
						author: 'Mark Twain',
						content: 'Everyone is a moon and has a dark side which he never shows to anybody.'
					}
				}
			},
			'/perfumes' : {
				type: 'page',
				template: 'left-sidebar.html',
				data: {
					title: 'Perfumes',
					content: '<h1>Perfumes</h1>',
					quote: {
						author: 'Mark Twain',
						content: 'Everyone is a moon and has a dark side which he never shows to anybody.'
					}
				}
			},
			'/about' : {
				type: 'page',
				template: 'right-sidebar.html',
				data: {
					title: 'About',
					content: '<h1>About</h1>',
					quote: {
						author: 'Mark Twain',
						content: 'Everyone is a moon and has a dark side which he never shows to anybody.'
					}
				}
			},
			'/shop' : {
				type: 'link',
				data: 'http://sweetoctobershop.etsy.com/'
			},
			'/contact' : {
				type: 'page',
				template: 'no-sidebar.html',
				data: {
					title: 'Contact',
					content: '<h1>Contact</h1>',
					quote: {
						author: 'Mark Twain',
						content: 'Everyone is a moon and has a dark side which he never shows to anybody.'
					}
				}
			}
		}
	};

	next();
});

// 3. serve static resources
app.get( /^\/js|css|images/, function( req, res, next ) {
	var path = __dirname + '/sites/' + req.site.id + '/resources' + req.path;
	res.sendfile( path );
});

// 4. serve site pages
app.get( /.*/, function( req, res ) {
	
	var page = req.site.pages[ req.path ];

	if ( page ) {
		if ( 'link' === page.type ) {
			res.location( page.data );
			res.send( 302 );
		} else {
			res.render( 
				req.site.id + '/templates/' + page.template, 
				page.data 
			);
		}
	}
});

// 5. handle 404
app.use( function( req, res ) {
	res.status( 404 );
	res.render( 
			'404', 
			{
				title: '404: Not Found'
			} 
	);
});

// 6. handle 500
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