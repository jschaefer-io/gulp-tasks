/**
 * Include Configuration File
 */
const config = require('../config');

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
	for (var i = 0; i < config.paths.assets.dirs.length; i++) {
		gulp.src(config.paths.assets.dirs[i].from)
			.pipe(gulp.dest(config.paths.dirs.to + '/' + config.paths.assets.dirs[i].to));
	}
});

/**
 * gulp minified build task
 **/
gulp.task('build', ['styles', 'scripts', 'assets'], function(){
	gulp.src(config.paths.dirs.to + '/js/**/*', {base: './'})
		.pipe(jsmin())
		.pipe(gulp.dest('./'));

	gulp.src(config.paths.dirs.to + '/css/**/*', {base: './'})
		.pipe(cssmin())
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
		.pipe(gulp.dest(config.paths.dirs.to + '/css/'));
});

/**
* gulp basic scripts task
**/
gulp.task('scripts', function(){
	return config.paths.js.files.forEach((jsFile)=>{
		gulp.src(jsFile)
			.pipe(concat('app.js'))
			.pipe(babel({
				presets: ['env']
			}).on('error', function(error){
				return notify().write(error);
			}))
			.pipe(gulp.dest(config.paths.dirs.to + '/js/'));
	});
});


/**
* gulp basic watch task
**/
gulp.task('default', ['scripts', 'styles', 'assets'], function(){
	return gulp.watch(config.paths.dirs.from + '/**/*', ['scripts', 'styles', 'assets']);
})


/**
 * gulp browser sync task
 **/
gulp.task('sync', ['scripts', 'styles', 'assets'], function(){
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
	gulp.watch(config.paths.dirs.from + '/**/*', ['sync-build'])
});


/**
* gulp browser reload handler
**/
gulp.task('sync-build', ['scripts', 'styles', 'assets'], function(done){
	browserSync.reload();
    done();
});


/**
 * gulp task to generate the above the fold css files from the abovethefold.json
 **/
gulp.task('abovethefold', function(){
	let gen = require('../abovethefold.json'),
		name = 'abovefold',
		addConfig = (array)=>{
			return [config.paths.scss.settings].concat(array);
		};

	let list = [];
	list.push({
		name: '--all',
		files: gen.full
	});
	for(let page in gen.pages){
		list.push({
			name: page.replace(/(\\|\/)/g, '__'),
			files: gen.pages[page]
		});
	}
	list.forEach((task)=>{
		return gulp.src(addConfig(task.files))
			.pipe(concat('fold' + task.name + '.scss'))
			.pipe(sass({
				includePaths: config.paths.scss.includePaths
			}).on('error', function(error){
				return notify().write(error);
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: true
			}))
			.pipe(cssmin())
			.pipe(gulp.dest(config.paths.dirs.to + '/css/abovethefold/'));
	})
});


/**
 * generates a styleguide from the compiled css
 * @see http://jonathantneal.github.io/mdcss-theme-github/demo/
 **/
gulp.task('styleguide', ['styles'], function () {
	return gulp.src(config.paths.dirs.to + '/css/' + config.options.styleguide.file)
		.pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
		.pipe(
			postcss([
				mdcss({
					destination: config.options.styleguide.folder,
					examples: {
						css: ['../' + config.paths.dirs.to + '/css/' + config.options.styleguide.file]
					}
				})
			])
		);
});

