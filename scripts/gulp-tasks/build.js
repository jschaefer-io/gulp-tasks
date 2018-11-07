const gulp = require('gulp');
const jsmin = require('gulp-jsmin');
const cssmin = require('gulp-cssmin');

/**
 * gulp minified build task
 **/
module.exports = {
    before: ['scripts', 'styles', 'assets', 'views'],
    task: (config) => {
        gulp.src(config.paths.scss.dist + '/**/*.css', {base: './'})
            .pipe(cssmin())
            .pipe(gulp.dest('./'));

        gulp.src(config.paths.js.dist + '/**/*.js', {base: './'})
            .pipe(jsmin())
            .pipe(gulp.dest('./'));
    }
};