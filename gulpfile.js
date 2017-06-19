/**
 * defs
 **/
var gulp 			= require('gulp'),
	concat 			= require('gulp-concat'),
	sass 			= require('gulp-sass'),
	jsmin			= require('gulp-jsmin'),
	cssmin			= require('gulp-cssmin'),
	notify 			= require('gulp-notify'),
	autoprefixer 	= require('gulp-autoprefixer');

/**
 * basic files array
 **/
var paths = {
	'dirs'	: {
		'from' 	: './src',
		'to'	: './dist'
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
	gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(jsmin())
		.pipe(gulp.dest(paths.dirs.to + '/js/'));

	gulp.src(paths.scss.files)
		.pipe(sass({
			includePaths: paths.scss.includePaths
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(paths.dirs.to + '/css/'))
		.pipe(notify('Build task successful!'));
});



/**
 * gulp watched build task
 **/
gulp.task('default', function(){
	return gulp.watch(paths.dirs.from + '/**/*', function(){
		gulp.src(paths.js.files)
			.pipe(concat('app.js'))
			.pipe(gulp.dest(paths.dirs.to + '/js/'));

		gulp.src(paths.scss.files)
			.pipe(sass({
			includePaths: paths.scss.includePaths
			}).on('error', function(error){
				return notify().write(error);
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: true
			}))
			.pipe(gulp.dest(paths.dirs.to + '/css/'))
			.pipe(notify('Build task successful!'));
	});
})