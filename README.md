# web-tasks
This repository contains a lightweight easy to extend task-library, meant to kick off basic web projects as fast as possible.

## Scripts
- `npm run build` Compile and minify the SCSS/SASS and JS files + kicks of the assets task.
- `npm run styles` Compiles the SCSS files.
- `npm run scripts` Compiles the JS files.
- `npm run views` Compiles the Pug files
- `npm run assets` Copys all assets to the target directory.
- `npm run dev` Default watch task. Uses the assets, styles, views and scripts tasks.
- `npm run sync` Watch task with browsersync. Uses assets, styles, views and scripts tasks.

## Config
Main configuration happens in the `config.js`-File.
