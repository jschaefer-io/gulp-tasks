const gulp = require('gulp');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const merge = require('merge-stream');

/**
 * gulp basic scripts task
 **/
module.exports = {
    before: [],
    task: (config) => {
        const scripts = config.paths.js.files.map((jsFile) => {
            return gulp.src(jsFile)
                .pipe(concat('app.js'))
                .pipe(babel({
                    presets: ['@babel/env']
                }).on('error', function (error){
                    return notify().write(error);
                }))
                .pipe(gulp.dest(config.paths.js.dist));
        });
        return merge(...scripts);
    }
};