module.exports = function( req, res, next ) {
	var path = '../sites/' + req.site.id + '/resources' + req.path;
	res.sendfile( path );
};