const gulp = require('gulp');

/**
 * gulp basic watch task
 **/
module.exports = {
    before: ['scripts', 'styles', 'assets', 'views'],
    task: (config) => {
        return gulp.watch(config.paths.watch, ['scripts', 'styles', 'assets', 'views']);
    }
};