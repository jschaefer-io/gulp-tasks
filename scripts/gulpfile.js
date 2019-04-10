const jsonfile = require('jsonfile');
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

// Load main config file
const config = jsonfile.readFileSync('config.json');

// Load all tasks from the gulp-tasks folder
const taskFolder = path.resolve(__dirname, 'gulp-tasks');
const tasks = fs.readdirSync(taskFolder);

// Dynamically load them and sort them by the dependency tasks
let tmpTaskList = tasks.map(file => {
    const filePath = path.resolve(taskFolder, file);
    return {
        path: filePath,
        task: require(filePath),
        name: path.basename(file, '.js')
    }
});

const taskList = [];
const taskSet = new Set();
while (tmpTaskList.length > 0) {
    tmpTaskList = tmpTaskList.filter(t => {
        let notInsert = false;
        t.task.before.forEach(d => {
            if (!taskSet.has(d)) {
                notInsert = true;
            }
        });
        if (!notInsert) {
            taskList.push(t);
            taskSet.add(t.name);
        }
        return notInsert;
    });
}


// Register them to gulp based on their filename
taskList.forEach((taskInfo) => {
    gulp.task(taskInfo.name, gulp.series(...taskInfo.task.before, (...a) => {
        return taskInfo.task.task(config, ...a);
    }));
});