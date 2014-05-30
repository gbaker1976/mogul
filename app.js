var express = require( 'express' );
var logfmt = require( 'logfmt' );
var hbs = require( 'hbs' );
var fs = require( 'fs' );
var app = express();
var fieldsTemplatePath = __dirname + '/sites/fields.html';
var fieldsTemplate = '';

app.set( 'views', __dirname + '/sites' );
app.engine( 'html', hbs.__express );
app.set( 'view engine', 'html' );

// log all requests
app.use( logfmt.requestLogger() );

// establish account context
app.use( function( req, res, next ){
	req.site = {
		id: 'sweet_october',
		pages: {
			'/' : {
				type: 'page',
				template: 'index.html',
				data: {
					title: 'Sweet October: Intoxicating Scents for Lovers of the Dark',
					content: '<header><h2>Intoxicating Scents for Lovers of the Dark</h2></header>',
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
					title: 'Sweet October: Perfumes - Intoxicating Scents for Lovers of the Dark',
					content: '<header><h2>Perfumes</h2><span class="byline">This is a byline.</span></header>',
					quote: {
						author: 'Henry Wadsworth Longfellow',
						content: 'Into each life some rain must fall, somedays must be dark and dreary.'
					}
				}
			},
			'/about' : {
				type: 'page',
				template: 'right-sidebar.html',
				data: {
					title: 'Sweet October: About - Intoxicating Scents for Lovers of the Dark',
					content: '<header><h2>About Sweet October</h2></header>',
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
					title: 'Sweet October: Contact - Intoxicating Scents for Lovers of the Dark',
					content: '<header><h2>Contact</h2></header>',
					quote: {
						author: 'Henry Wadsworth Longfellow',
						content: 'Into each life some rain must fall, somedays must be dark and dreary.'
					}
				}
			}
		},
		forms: {
			'/contact' : {
				fields: [{
					textInput: true,
					id: 'name',
					defaultValue: 'foo',
					placeholder: 'please enter your name',
					maxLength: 50
				}],
				processor: function( req, res ) {
					res.send( 201, {

					});
				}
			}
		}
	};

	next();
});

// handle forms
app.get( '/form/:formId', function( req, res, next ){
	var form = req.site.forms[ req.param( 'formId' )];
	var fields = form ? form.fields : [];
	var field = null;
	var formHtml = '';

	while( field = fields.shift() ) {
		formHtml += hbs.create().compile( fieldsTemplate )( field );
	}

	res.render( 'no-sidebar.html', { content: formHtml } );
});
app.post( '/form/:formId', function( req, res, next ){
	var processor = null;

	if ( req.site.forms ) {
		if ( processor = req.site.forms[ req.param( 'formId' )] ) {
			processor.call( {}, req, res );
		}
	}
});

// serve static content
app.get( /^\/js|css|images/, function( req, res, next ) {
	var path = __dirname + '/sites/' + req.site.id + '/resources' + req.path;
	res.sendfile( path );
});

// handle dynamic pages
app.get( /.*/, function( req, res, next ) {
	
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
	} else {
		next();
	}
});

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

// fields template before starting the app;
fs.readFile( fieldsTemplatePath, function( err, file ) {
	if ( err ) throw err;

	fieldsTemplate = file;
	
	app.listen( port, function() {
		console.log( 'Listening on ' + port );
	});
});