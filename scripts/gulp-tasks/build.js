const gulp = require('gulp');
const jsmin = require('gulp-jsmin');
const cleanCSS = require('gulp-clean-css');
const merge = require('merge-stream');

/**
 * gulp minified build task
 **/
module.exports = {
    before: ['scripts', 'styles', 'assets', 'views'],
    task: (config) => {
        const styles = gulp.src(config.paths.scss.dist + '/**/*.css', {base: './'})
            .pipe(cleanCSS())
            .pipe(gulp.dest('./'));

        const scripts = gulp.src(config.paths.js.dist + '/**/*.js', {base: './'})
            .pipe(jsmin())
            .pipe(gulp.dest('./'));

        return merge(styles, scripts);
    }
};