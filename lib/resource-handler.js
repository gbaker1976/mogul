function loadResource( req, res, next ) {
	var path = req.site.basePath + '/resources' + req.path;
	console.log(path);
	res.sendfile( path );
}

module.exports = {
	script: function( req, res, next ){
		req.path = '/js/' + req.path;
		loadResource.apply( {}, arguments );
	},
	image: function( req, res, next ){
		req.path = '/images/' + req.path;
		loadResource.apply( {}, arguments );
	},
	stylesheet: function( req, res, next ){
		req.path = '/css/' + req.path;
		loadResource.apply( {}, arguments );
	}
};