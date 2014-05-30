var fs = require( 'fs' );
var basePath = __dirname + '../sites';

module.exports = function( req, res, next ){
	req.site = require( '../data.json' );

	fs.realpath( basePath + '/' + req.site.id, function( err, path ){
		req.site.basePath = path;

		fs.realpath( basePath, function( err, path ){
			if ( err ) throw err;
			req.basePath = path;

			next();
		});
	});
};