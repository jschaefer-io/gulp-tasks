const gulp = require('gulp');

/**
 * gulp asset copy task
 **/
module.exports = {
    before: [],
    task: (config) => {
        return config.paths.assets.files.forEach((file) => {
            gulp.src(file.from)
                .pipe(gulp.dest(config.paths.assets.dist + '/' + file.to));
        });
    }
};