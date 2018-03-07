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
- `npm run guide` Generates a styleguide using `kss-node`.
- `npm run abovefold` Generates abovethefold css files using `puppeteer`. For the time beeing, puppeteer needs to be installed manually because it gets shipped with Chromium (~150MB) everytime. Use `npm install --save-dev puppeteer` to use this script properly.

## Config
Main configuration happens in the `config.js`-File.

## Component Management
This project uses Emily-CM, a slim component manager. See [its repository for the documentation](https://github.com/jschaefer-io/emily-cm#readme)
