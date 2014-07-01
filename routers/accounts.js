var couchbase = require( 'couchbase' );
var db = new couchbase.Connection({ host: 'localhost:8091', bucket: 'beer-sample' });

module.exports = {
	register: function( app ){

		// CRUD accounts collection
		app.get( '/accounts', function (req, res, next) {
			db.get( 'new_holland_brewing_company-sundog', function(err, result) {
        		if (err) throw err;

        		res.send( result );
       			return next();
      		});
		});

		app.post( '/accounts', function (req, res, next) {
		  res.send('post accounts');
		  return next();
		});

		// CRUD accounts resource
		app.get( '/accounts/:id', function (req, res, next) {
		  res.send( 'get ' + req.params.id );
		  return next();
		});

		app.put( '/accounts/:id', function (req, res, next) {
		  res.send( 'put to ' + req.params.id );
		  return next();
		});

		app.del( '/accounts/:id', function (req, res, next) {
		  res.send( 'delete ' + req.params.id );
		  return next();
		});

	}	
};