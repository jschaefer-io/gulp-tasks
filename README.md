# gulp-tasks
This repository contains a lightweight easy to extend gulp task, meant to kick off basic web projects as fast as possible.

## Scripts
- `npm run build` Compile and minify the SCSS/SASS and JS files + kicks of the assets task.
- `npm run styles` Compiles the SCSS files.
- `npm run scripts` Compiles the JS files.
- `npm run assets` Copys all assets to the target directory.
- `npm run dev` Default watch task. Uses the assets, styles and scripts tasks.
- `npm run sync` Watch task with browsersync. Uses assets, styles and scripts tasks.
- `npm run guide` Generates a styleguide using `mdcss`.
- `npm run abovefold` Generates abovethefold css files using `puppeteer`.

## Config
Main configuration happens in the `config.js`-File, where all options are explained via comments.