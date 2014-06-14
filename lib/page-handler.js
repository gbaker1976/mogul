var fs = require( 'fs' );
var hbs = require( 'hbs' );
var fieldsTemplate = '';

// handle form rendering
function renderFormHtml( page ){
	var fields = page.fields;
	var field = null;
	var formHtml = '';

	while( field = fields.shift() ) {
		formHtml += hbs.handlebars.compile( fieldsTemplate )( field );
	}

	return formHtml;
}

function loadFieldsTemplate( path, callback ) {
	fs.readFile( path, { encoding: 'utf-8' }, function( err, file ) {
		if ( err ) throw err;

		fieldsTemplate = file;
	});
}

function processPage( page, req, res, next ) {
	if ( page ) {
		switch ( page.type ) {
			case 'link' :
				res.location( page.data );
				res.send( 302 );
				return;
			break;
			case 'form' :
				page.data.formHtml = renderFormHtml( page.data );
			break;
				
		}

		res.render( 
			req.site.id + '/templates/' + page.template, 
			page.data 
		);
	} else {
		next();
	}
}

module.exports = function( req, res, next ) {
	
	var page = req.site.pages[ req.path ];

	if ( fieldsTemplate ) {
		processPage( page, req, res, next );
	} else {
		loadFieldsTemplate( req.basePath + '/fields.html', function( template ){
			processPage( page, req, res, next );
		});
	}
};