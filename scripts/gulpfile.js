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
	kss 			= require('kss'),
	lec 			= require('gulp-line-ending-corrector'),
	babel 			= require('gulp-babel'),
	pug 			= require('gulp-pug'),
	emlProvide		= require('./provide-modules')();


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
gulp.task('build', ['styles', 'scripts', 'assets'], function(){
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
				presets: ['env']
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
 * gulp task to generate the above the fold css files from the abovethefold.json
 **/
gulp.task('abovethefold', function(){
	let gen = require('../abovethefold.json'),
		name = 'abovefold';

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
		return gulp.src(task.files)
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
			.pipe(concat('fold' + task.name + '.scss'))
			.pipe(gulp.dest(config.options.abovefold.dist));
	})
});


/**
 * Builds the HTML-Templates using pug-templates
 * @see https://pugjs.org/api/getting-started.html
 */
gulp.task('views', function() {
	return gulp.src(config.paths.pug.files)
		.pipe(pug({
			pretty: true
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(gulp.dest(config.paths.pug.dist));
});


/**
 * generates a styleguide from the compiled css
 * @see https://github.com/kss-node/kss-node
 **/
gulp.task('styleguide', ['styles'], function () {
	gulp.src(config.paths.scss.dist + '/' + config.options.styleguide.cssDist)
		.pipe(gulp.dest(config.options.styleguide.dist));

	return kss({
		source: config.options.styleguide.files,
		destination: config.options.styleguide.dist,
		css: [config.options.styleguide.cssDist],
		homepage: config.options.styleguide.homepage,
		title: config.options.styleguide.title,
		builder: 'node_modules/michelangelo/kss_styleguide/custom-template/'
	});
});

