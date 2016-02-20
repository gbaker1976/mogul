var gulp = require( 'gulp' );
var postcss = require( 'gulp-postcss' );
var babel = require( 'gulp-babel' );
var requirejsOptimize = require( 'gulp-requirejs-optimize' );
var postcssNested = require( 'postcss-nested' );
var cssnext = require( 'gulp-cssnext' );
var path = require( 'path' );
var fs = require( 'fs' );
var exec = require( 'child_process' ).exec;
var wrench = require( 'wrench' );
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

gulp.task( 'build-css', [ 'clean-dist' ], function(){
	return gulp.src( './src/css/_all.css' )
    	.pipe( cssnext({
    		compress: false
    	}))
    	.pipe( postcss( [ postcssNested ] ) )
    	.pipe( gulp.dest( './dist/css' ) )
});

gulp.task( 'transpile-js', [ 'clean-dist' ], function(){
	return gulp.src( './src/js/**/*.js' )
		.pipe( babel({
				presets: [ 'es2015' ],
                plugins: [ 'transform-es2015-modules-amd' ],
                comments: false
			})
        )
		.pipe( gulp.dest( './dist/tmp/js' ) );
});

gulp.task( 'bundle-js', [ 'clean-dist', 'transpile-js' ], function(){
	return gulp.src( './dist/tmp/js/**/*.js' )
        .pipe( requirejsOptimize(function( file ){
            return {
                name: file.relative.replace( '.js', '' ),
                uglify: false,
                insertRequire: [ file.relative.replace( '.js', '' ) ]
            }
        }))
		.pipe( gulp.dest( './dist/js' ) );
});

gulp.task( 'copy-require', [ 'bundle-js' ], function(){
	return gulp.src( './bower_components/requirejs/require.js' )
		.pipe( gulp.dest( './dist/js' ) );
});

gulp.task( 'clean-dist', function( cb ) {
    fs.exists( './dist', function( exists ){
        if ( exists ) {
            wrench.rmdirRecursive( './dist', function(){
                fs.mkdir( './dist', cb );
            });
        } else {
            fs.mkdir( './dist', cb );
        }
    });
});

gulp.task( 'clean-dist-tmp', function( cb ) {
	wrench.rmdirSyncRecursive( './dist/tmp' );
    cb();
});

gulp.task( 'start-server', function(){
    var pid = exec('node ./app.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      });
});

gulp.task( 'workbench', [ 'default', 'start-server' ], function() {
	browserSync({
		proxy: 'http://localhost:5000',
        port: 3000,
        browser: 'google chrome'
	});

    // gulp.watch( 'js/**/*.js', { cwd: 'src' },  [ 'build-js' ] );
    // gulp.watch( 'css/**/*.css', { cwd: 'src' }, [ 'build-css' ] );
    // gulp.watch( '*.html', { cwd: 'src' }, [ 'build-js' ] );

    gulp.watch( [ 'js/**/*.js', 'css/**/*.css', '**/*.html' ], { cwd: 'dist' },  reload );
});

gulp.task( 'default', [ 'clean-dist', 'build-css', 'transpile-js', 'bundle-js', 'copy-require' ] );
