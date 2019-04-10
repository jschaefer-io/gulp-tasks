const gulp = require('gulp');
const merge = require('merge-stream');

/**
 * gulp asset copy task
 **/
module.exports = {
    before: [],
    task: (config) => {
        const assets = config.paths.assets.files.map((file) => {
            return gulp.src(file.from)
                .pipe(gulp.dest(config.paths.assets.dist + '/' + file.to));
        });
        return merge(...assets);
    }
};