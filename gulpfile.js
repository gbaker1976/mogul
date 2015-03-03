var gulp = require( 'gulp' );
var postcss = require( 'gulp-postcss' );
var postcssNested = require( 'postcss-nested' );
var cssnext = require( 'gulp-cssnext' );
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

gulp.task( 'css', function(){
	return gulp.src( './src/css/_all.css' )
	.pipe( cssnext({
		compress: true
	}))
	.pipe( postcss( [ postcssNested ] ) )
	.pipe( gulp.dest( './dist/css' ) )
});

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
gulp.watch( 'css/**/*.css', { cwd: 'src' }, [ 'css' ] );
gulp.watch( 'themes/**/*', { cwd: 'src' }, [ 'copy-themes' ] );
gulp.watch( '*.html', { cwd: 'src' }, [ 'copy-html' ] );

gulp.watch( [ 'js/**/*.js', 'css/**/*.css', '**/*.html' ], { cwd: 'dist' },  reload );

gulp.task( 'default', [ 'clean-dist', 'css', 'app-js', 'copy-themes', 'copy-html', 'serve' ] );
