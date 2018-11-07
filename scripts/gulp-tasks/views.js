const gulp = require('gulp');
const tasap = require('gulp-tasap');

/**
 * gulp browser sync task
 **/
module.exports = {
    before: [],
    task: (config) => {
        return gulp.src(config.paths.tasap.files)
            .pipe(tasap({
                pattern: '[A-Z]\\w+'
            }).on('error', function (error){
                return notify().write(error);
            }))
            .pipe(gulp.dest(config.paths.tasap.dist));
    }
};