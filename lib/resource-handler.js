module.exports = function( req, res, next ) {
	var path = __dirname + '/../sites/' + req.site.id + '/resources' + req.path;
	res.sendfile( path );
};