const config = require('./provide-config');
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

// Load all tasks from the gulp-tasks folder
const taskFolder = path.resolve(__dirname, 'gulp-tasks');
const tasks = fs.readdirSync(taskFolder);

// Dynamically load them and register them to gulp based on their filename
tasks.forEach((file) => {
    const filePath = path.resolve(taskFolder, file);
    const task = require(filePath);
    gulp.task(path.basename(filePath, '.js'), task.before, (...a) => {
        return task.task(config, ...a);
    });
});