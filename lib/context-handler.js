var fs = require( 'fs' );
var resolver = require( 'resolver' );
var path = require( 'path' );
var cwd = process.cwd();
var basePath = path.join( cwd, 'sites' );
var memjs = require( 'memjs' );

module.exports = function( req, res, next ){
	var host = req.hostname;
	var site;

	if ( !host ) {
		res.send( 400, 'host header must be supplied' )
			.end();
		return;
	}

	var client = memjs.Client.create( process.env.MEMCACHEDCLOUD_SERVERS, {
		username: process.env.MEMCACHEDCLOUD_USERNAME,
		password: process.env.MEMCACHEDCLOUD_PASSWORD
	});

    client.get( 'test-data', function( err, value, key ){
        var data;

        if ( value ) {
            data = JSON.parse( value );

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
        } else {
            next();
        }
    });
};
