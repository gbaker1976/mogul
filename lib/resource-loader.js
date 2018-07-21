var fs = require('fs');

module.exports = function( req, res, next ){
	var path = req.path;

	if (path) {
		fs.readFile( process.cwd() + '/src' + path + '/css/main.css', function ( err, content ) {
	    	if (err) return res.status(404).send( 'not found' );

			res.set('Content-Type', 'text/css');
	    	return res.send( content.toString() );
	    });
	} else {
		res.status(404).send( 'not found' );
	}
}
