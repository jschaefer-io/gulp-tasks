/**
 * Filedirectories
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
	'assets': {
		'dirs' : [
			{
				'from': './src/img/**/*',
				'to': 'img'
			}
		]
	},
	'js'	: {
		'files' : [
			'./src/js/app.js'
		]
	},
};


/**
 * Options regarding some tasks
 **/
var options = {
	'sync' : {
		'rel' : true,
		'value' : '../'
	},
	'styleguide': {
		'folder' : 'styleguide',
		'file' : 'app.css'
	}
}


/**
 * Dependencies
 **/
var gulp 			= require('gulp'),
	concat 			= require('gulp-concat'),
	sass 			= require('gulp-sass'),
	jsmin			= require('gulp-jsmin'),
	cssmin			= require('gulp-cssmin'),
	notify 			= require('gulp-notify'),
	autoprefixer 	= require('gulp-autoprefixer'),
	browserSync 	= require('browser-sync').create(),
	postcss 		= require('gulp-postcss'),
	mdcss 			= require('mdcss'),
	lec 			= require('gulp-line-ending-corrector'),
	babel 			= require('gulp-babel');


/**
 * gulp asset copy task
 **/
gulp.task('assets', function(){
	for (var i = 0; i < paths.assets.dirs.length; i++) {
		gulp.src(paths.assets.dirs[i].from)
			.pipe(gulp.dest(paths.dirs.to + '/' + paths.assets.dirs[i].to));
	}
});

/**
 * gulp minified build task
 **/
gulp.task('build', ['assets'], function(){
	gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(babel({
			presets: ['env']
		}).on('error', function(error){
			return notify().write(error);
		}))
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
		.pipe(gulp.dest(paths.dirs.to + '/css/'));
});


/**
* gulp basic styles task
**/
gulp.task('styles', function(){
	return gulp.src(paths.scss.files)
		.pipe(sass({
		includePaths: paths.scss.includePaths
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(paths.dirs.to + '/css/'));
});

/**
* gulp basic scripts task
**/
gulp.task('scripts', function(){
	return gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(babel({
			presets: ['env']
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(gulp.dest(paths.dirs.to + '/js/'));
});


/**
* gulp basic watch task
**/
gulp.task('default', ['scripts', 'styles', 'assets'], function(){
	return gulp.watch(paths.dirs.from + '/**/*', ['scripts', 'styles', 'assets']);
})


/**
 * gulp browser sync task
 **/
gulp.task('sync', ['scripts', 'styles', 'assets'], function(){
	var obj = {};
	if (options.sync.rel) {
		obj.server = {
            baseDir: options.sync.value
        };
	}
	else{
		obj.proxy = options.sync.value;
	}
	browserSync.init(obj);
	gulp.watch(paths.dirs.from + '/**/*', ['sync-build'])
});


/**
* gulp browser reload handler
**/
gulp.task('sync-build', ['scripts', 'styles', 'assets'], function(done){
	browserSync.reload();
    done();
});



/**
 * generates a styleguide from the compiled css
 * @see http://jonathantneal.github.io/mdcss-theme-github/demo/
 **/
gulp.task('styleguide', ['styles'], function () {
	return gulp.src(paths.dirs.to + '/css/' + options.styleguide.file)
		.pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
		.pipe(
			postcss([
				mdcss({
					destination: options.styleguide.folder,
					examples: {
						css: ['../' + paths.dirs.to + '/css/' + options.styleguide.file]
					}
				})
			])
		);
});

