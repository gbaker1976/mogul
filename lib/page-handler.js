var path = require( 'path' );
var cwd = process.cwd();
var resolver = require( path.join( cwd, 'lib/resolver' ) );
var stringUtil = require( path.join( cwd, 'lib/strings' ) );
var paths = {
    NotFound: path.join( cwd, '/sites/404.html' ),
    Error: path.join( cwd, '/sites/500.html' )
};

function processPage( page, req, res, next ) {
	if ( page && page.active ) {

        if ( page.template ) {
            res.render(
                path.join( req.site.basePath , 'templates' , page.template ),
    			page.data
    		);
        } else {
            res.type( page[ 'content-type' ] );
            res.send( stringUtil.desanitize( page.content ) )
                .end();
        }
	} else {
        res.status( 404 );
        res.sendFile( paths.NotFound, function(){
            res.end();
        })
	}
}

module.exports = function( req, res, next ) {
	var page = resolver.findItemByAlias( req.path, req.site.pages );
	processPage( page, req, res, next );
};
