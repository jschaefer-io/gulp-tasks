const gulp = require('gulp');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

/**
 * gulp basic scripts task
 **/
module.exports = {
    before: [],
    task: (config) => {
        return config.paths.js.files.forEach((jsFile) => {
            gulp.src(jsFile)
                .pipe(concat('app.js'))
                .pipe(babel({
                    presets: ['@babel/env']
                }).on('error', function (error){
                    return notify().write(error);
                }))
                .pipe(gulp.dest(config.paths.js.dist));
        });
    }
};