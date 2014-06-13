var fs = require( 'fs' );
var basePath = __dirname + '/../sites';

module.exports = function( req, res, next ){
	var host = 'secret-ridge-3506.herokuapp.com'; //req.host;

	if ( !host ) {
		res.send( 400, 'host header must be supplied' );
		return;
	}

	req.site = require( '../data.json' )[ host ];

	if ( !req.site ) {
		res.send( 404, 'requested resource not found' );
		return;
	}

	fs.realpath( basePath + '/' + req.site.id, function( err, path ){
		req.site.basePath = path;

		fs.realpath( basePath, function( err, path ){
			if ( err ) throw err;

			req.basePath = path;

			next();
		});
	});
};