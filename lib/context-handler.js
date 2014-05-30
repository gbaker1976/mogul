module.exports = function( req, res, next ){
	req.site = require( '../data.json' );

	next();
};