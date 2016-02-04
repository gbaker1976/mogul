var fs = require( 'fs' );
var resolver = require( 'resolver' );
var path = require( 'path' );
var cwd = process.cwd();
var basePath = path.join( cwd, 'sites' );

module.exports = function( req, res, next ){
	var host = req.hostname;
    var site;

	if ( !host ) {
		res.send( 400, 'host header must be supplied' )
            .end();
		return;
	}

    fs.readFile( path.join( cwd, 'data.json' ), 'utf-8', function( err, contents ){
        var data = JSON.parse( contents );

        site = resolver.findItemByAlias( host, data.sites );

        if ( !site ) {
    		res.end();
    		return;
    	}

        if ( site.active ) {
            req.site = site;
        }

		req.site.basePath = path.join( basePath, req.site.id );
        next();

    });
};
