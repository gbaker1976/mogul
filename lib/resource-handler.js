module.exports = {
	script: function( req, res, next ){
		var path = req.site.basePath + '/resources/js/' + req.path;
		res.sendfile( path );
	},
	image: function( req, res, next ){
		var path = req.site.basePath + '/resources/images/' + req.path;
		res.sendfile( path );
	},
	stylesheet: function( req, res, next ){
		var path = req.site.basePath + '/resources/css/' + req.path;
		res.sendfile( path );
	}
};