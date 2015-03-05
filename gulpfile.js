var gulp = require( 'gulp' );
var postcss = require( 'gulp-postcss' );
var postcssNested = require( 'postcss-nested' );
var cssnext = require( 'gulp-cssnext' );
var path = require( 'path' );
var fs = require( 'fs' );
var wrench = require( 'wrench' );
var aglio = require( 'gulp-aglio' );
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

var copyFile = function( src, dest, cb ){
	fs.readFile( src, function( err, data ){
		if ( err ) cb( err );
		fs.writeFile( dest, data, cb );
	});
};

gulp.task( 'gen-api-docs', function() {
	return gulp.src( './rest/doc/*.md' )
	.pipe( aglio( { template: 'default' } ) )
	.pipe( gulp.dest( './dist/rest' ) );
});

gulp.task( 'css', function(){
	return gulp.src( './src/css/_all.css' )
	.pipe( cssnext({
		compress: false
	}))
	.pipe( postcss( [ postcssNested ] ) )
	.pipe( gulp.dest( './dist/css' ) )
});

gulp.task( 'app-js', function(){
	return gulp.src( './src/js/app.js' )
	.pipe( gulp.dest( './dist/js' ) );
});


gulp.task( 'theme-css', function(){
	return gulp.src( './src/themes/wasabi/src/css/theme.css' )
	.pipe( cssnext({
		compress: false
	}))
	.pipe( postcss( [ postcssNested ] ) )
	.pipe( gulp.dest( './src/themes/wasabi/dist/css' ) )
});

gulp.task( 'theme-js', function(){
	return gulp.src( './src/themes/wasabi/src/js/main.js' )
	.pipe( gulp.dest( './src/themes/wasabi/dist/js' ) );
});

gulp.task(
	'clean-themes',
	function( cb ) {
		fs.exists( './dist/theme', function( exists ){
			if ( exists ) {
				wrench.rmdirSyncRecursive( './dist/theme' );
			}
			fs.mkdir( './dist/theme', cb );
		});
	}
);

gulp.task(
	'copy-theme-html',
	function ( cb ) {
		copyFile( './src/themes/wasabi/src/theme.html', './src/themes/wasabi/dist/theme.html', cb );
	}
);

gulp.task(
	'copy-theme-img',
	function ( cb ) {
		wrench.copyDirRecursive( './src/themes/wasabi/src/img', './src/themes/wasabi/dist/img', { forceDelete: true }, cb );
	}
);

gulp.task(
	'copy-themes',
	function ( cb ) {
		wrench.copyDirRecursive( './src/themes/wasabi/dist', './dist/theme/wasabi', { forceDelete: true }, cb );
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
	'copy-html',
	function ( cb ) {
		copyFile( './src/index.html', './dist/index.html' );
		copyFile( './src/sites.html', './dist/sites.html', cb );
	}
);

gulp.task( 'serve', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		}
	});
});

gulp.watch( 'js/**/*.js', { cwd: 'src' },  [ 'app-js' ] );
gulp.watch( 'css/**/*.css', { cwd: 'src' }, [ 'css' ] );
gulp.watch( '*.html', { cwd: 'src' }, [ 'copy-html' ] );

gulp.watch( [ 'js/**/*.js', 'css/**/*.css', '**/*.html' ], { cwd: 'dist' },  reload );

gulp.task( 'default', [ 'clean-dist', 'gen-api-docs', 'css', 'app-js', 'theme', 'copy-html', 'serve' ] );
gulp.task( 'theme', [ 'clean-themes', 'theme-css', 'theme-js', 'copy-theme-html', 'copy-theme-img', 'copy-themes' ] );
