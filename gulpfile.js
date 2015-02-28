var gulp = require( 'gulp' );
var less = require( 'gulp-less' );
var minifyCss = require( 'gulp-minify-css' );
var path = require( 'path' );
var fs = require( 'fs' );
var wrench = require( 'wrench' );

var copyFile = function( src, dest, cb ){
	fs.readFile( src, function( err, data ){
		if ( err ) cb( err );
		fs.writeFile( dest, data, cb );
	});
};

gulp.task(
	'app-less',
	function () {
		return gulp.src( './src/less/**/_all.less' )
		.pipe(
			less({
				paths: [ path.join( __dirname, 'less', 'lib') ],
				filename: 'main.css'
			})
		)
		.pipe( minifyCss() )
		.pipe( gulp.dest( './dist/css' ) );
	}
);

gulp.task(
	'clean-dist',
	function( cb ) {
		wrench.rmdirSyncRecursive( './dist' );
		fs.mkdir( './dist', cb );
	}
);

gulp.task(
	'copy-themes',
	function ( cb ) {
		wrench.copyDirRecursive( './src/themes', './dist/themes', cb );
	}
);

gulp.task(
	'copy-html',
	function ( cb ) {
		copyFile( './src/index.html', './dist/index.html', cb );
	}
);

gulp.task(
	'copy-app',
	function ( cb ) {
		copyFile( './src/js/app.js', './dist/app.js', cb );
	}
);

gulp.task( 'default', [ 'clean-dist', 'app-less', 'copy-themes', 'copy-html', 'copy-app' ] );
