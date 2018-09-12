/**
 * Include Configuration File
 */
const config = require('./provide-config');

/**
 * Dependencies
 **/
const gulp 			= require('gulp'),
	concat 			= require('gulp-concat'),
	sass 			= require('gulp-sass'),
	jsmin			= require('gulp-jsmin'),
	cssmin			= require('gulp-cssmin'),
	notify 			= require('gulp-notify'),
	autoprefixer 	= require('gulp-autoprefixer'),
	browserSync 	= require('browser-sync').create(),
	babel 			= require('gulp-babel'),
	tasap 			= require('gulp-tasap');


/**
 * gulp asset copy task
 **/
gulp.task('assets', function(){
	config.paths.assets.files.forEach((file)=>{
		gulp.src(file.from)
			.pipe(gulp.dest(config.paths.assets.dist + '/' + file.to));
	});
});


/**
 * gulp minified build task
 **/
gulp.task('build', ['scripts', 'styles', 'assets', 'views'], function(){
	gulp.src(config.paths.scss.dist + '/**/*.css', {base: './'})
		.pipe(cssmin())
		.pipe(gulp.dest('./'));

	gulp.src(config.paths.js.dist + '/**/*.js', {base: './'})
		.pipe(jsmin())
		.pipe(gulp.dest('./'));
});


/**
* gulp basic styles task
**/
gulp.task('styles', function(){
	return gulp.src(config.paths.scss.files)
		.pipe(sass({
			includePaths: config.paths.scss.includePaths
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(concat('app.css'))
		.pipe(gulp.dest(config.paths.scss.dist));
});


/**
* gulp basic scripts task
**/
gulp.task('scripts', function(){
	return config.paths.js.files.forEach((jsFile)=>{
		gulp.src(jsFile)
			.pipe(concat('app.js'))
			.pipe(babel({
				presets: ['@babel/env']
			}).on('error', function(error){
				return notify().write(error);
			}))
			.pipe(gulp.dest(config.paths.js.dist));
	});
});


/**
* gulp basic watch task
**/
gulp.task('default', ['scripts', 'styles', 'assets', 'views'], function(){
	return gulp.watch(config.paths.watch, ['scripts', 'styles', 'assets', 'views']);
})


/**
 * gulp browser sync task
 **/
gulp.task('sync', ['scripts', 'styles', 'assets', 'views'], function(){
	var obj = {};
	if (config.options.sync.rel) {
		obj.server = {
            baseDir: config.options.sync.value
        };
	}
	else{
		obj.proxy = config.options.sync.value;
	}
	browserSync.init(obj);
	gulp.watch(config.paths.watch, ['sync-build'])
});


/**
* gulp browser reload handler
**/
gulp.task('sync-build', ['scripts', 'styles', 'assets', 'views'], function(done){
	browserSync.reload();
    done();
});



/**
 * Builds the HTML-Templates using tasap.js
 */
gulp.task('views', function() {
	return gulp.src(config.paths.tasap.files)
		.pipe(tasap({
			pattern: '[A-Z]\\w+'
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(gulp.dest(config.paths.tasap.dist));
});