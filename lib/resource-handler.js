module.exports = function( req, res, next ) {
	var path = req.site.basePath + '/resources' + req.path;
	res.sendfile( path );
};