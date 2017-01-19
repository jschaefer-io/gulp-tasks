/**
 * defs
 **/
var gulp 	= require('gulp'),
	concat 	= require('gulp-concat'),
	sass 	= require('gulp-sass'),
	watch	= require('gulp-watch'),
	jsmin	= require('gulp-jsmin'),
	cssmin	= require('gulp-cssmin');

/**
 * basic files array
 **/
var paths = {
	'dirs'	: {
		'from' 	: 'src',
		'to'	: 'dist'
	},
	'scss'	: {
		'files' : [
			'./src/scss/app.scss'
		],
		'includePaths' : [
		]
	},
	'js'	: {
		'files' : [
			'./src/js/app.js'
		]
	},
};


/**
 * gulp minified build task
 **/
gulp.task('build', function(){
	console.log('build js files (minified) ...');
	gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(jsmin())
		.pipe(gulp.dest('./' + paths.dirs.to + '/js/'));


	console.log('build scss files (minified) ...');
	gulp.src(paths.scss.files)
		.pipe(sass({
			includePaths: paths.scss.includePaths
		}))
		.pipe(cssmin())
		.pipe(gulp.dest('./' + paths.dirs.to + '/css/'));

	console.log('... done!');
});



/**
 * gulp watched build task
 **/
gulp.task('default', function(){
	return watch(paths.dirs.from + '/**/*', function(){

		console.log('build js files...');
		gulp.src(paths.js.files)
			.pipe(concat('app.js'))
			.pipe(gulp.dest('./' + paths.dirs.to + '/js/'));


		console.log('build scss files...');
		gulp.src(paths.scss.files)
			.pipe(sass({
				includePaths: paths.scss.includePaths
			}))
			.pipe(gulp.dest('./' + paths.dirs.to + '/css/'));

		console.log('... done!');
	});
})