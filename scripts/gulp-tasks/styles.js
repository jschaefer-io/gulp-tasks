const gulp = require('gulp');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

/**
 * gulp basic styles task
 **/
module.exports = {
    before: [],
    task: (config) => {
        return gulp.src(config.paths.scss.files)
            .pipe(sass({
                includePaths: config.paths.scss.includePaths
            }).on('error', function (error){
                return notify().write(error);
            }))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: true
            }))
            .pipe(concat('app.css'))
            .pipe(gulp.dest(config.paths.scss.dist));
    }
};