module.exports = function( req, res, next ){
	var processor = null;

	if ( req.site.forms ) {
		if ( processor = req.site.forms[ req.param( 'formId' )] ) {
			processor.call( {}, req, res );
		}
	}
};