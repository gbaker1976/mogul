module.exports = {
	register: function( app ){

		// CRUD assets collection
		app.get( '/assets/:assetId', function (req, res, next) {
		  res.send('get assets');
		  return next();
		});

		app.post( '/assets/:assetId', function (req, res, next) {
		  res.send('post assets');
		  return next();
		});

		// CRUD assets resource
		app.get( '/assets/:assetId/:id', function (req, res, next) {
		  res.send( 'get ' + req.params.id );
		  return next();
		});

		app.put( '/assets/:assetId/:id', function (req, res, next) {
		  res.send( 'put to ' + req.params.id );
		  return next();
		});

		app.del( '/assets/:assetId/:id', function (req, res, next) {
		  res.send( 'delete ' + req.params.id );
		  return next();
		});

	}	
};