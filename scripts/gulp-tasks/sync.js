const gulp = require('gulp');
const browserSync = require('browser-sync');

// Build Browser-Sync Instance
const sync = browserSync.create('Web-Tasks Sync');

/**
 * gulp browser sync task
 **/
module.exports = {
    before: ['scripts', 'styles', 'assets', 'views'],
    task: (config) => {
        const obj = {};
        if (config.options.sync.rel) {
            obj.server = {
                baseDir: config.options.sync.value
            };
        }
        else {
            obj.proxy = config.options.sync.value;
        }
        sync.init(obj);
        return gulp.watch(config.paths.watch, gulp.series('sync-build'));
    }
};