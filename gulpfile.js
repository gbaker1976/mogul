var gulp = require( 'gulp' );
var less = require( 'gulp-less' );
var minifyCss = require( 'gulp-minify-css' );
var path = require( 'path' );
var fs = require( 'fs' );
var wrench = require( 'wrench' );
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

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
				paths: [ path.join( __dirname, 'less', 'lib') ]
			})
		)
		.pipe( minifyCss() )
		.pipe( gulp.dest( './dist/css' ) );
	}
);

gulp.task( 'app-js', function(){
	return gulp.src( './src/js/app.js' )
	.pipe( gulp.dest( './dist/js' ) );
});

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
		wrench.copyDirRecursive( './src/themes', './dist/themes', { forceDelete: true }, cb );
	}
);

gulp.task(
	'copy-html',
	function ( cb ) {
		copyFile( './src/index.html', './dist/index.html' );
		copyFile( './src/sites.html', './dist/sites.html', cb );
	}
);

gulp.task( 'serve', function() {
	browserSync({
		server: {
			baseDir: './'
		}
	});
});

gulp.watch( 'js/**/*.js', { cwd: 'src' },  [ 'app-js' ] );
gulp.watch( 'less/**/*.less', { cwd: 'src' }, [ 'app-less' ] );
gulp.watch( 'themes/**/*', { cwd: 'src' }, [ 'copy-themes' ] );
gulp.watch( '*.html', { cwd: 'src' }, [ 'copy-html' ] );

gulp.watch( [ 'js/**/*.js', 'css/**/*.css', '**/*.html' ], { cwd: 'dist' },  reload );

gulp.task( 'default', [ 'clean-dist', 'app-less', 'app-js', 'copy-themes', 'copy-html', 'serve' ] );
