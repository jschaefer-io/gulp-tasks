const jsonfile = require('jsonfile');
const glob = require('glob');
const execa = require('execa');
const fs = require('fs');


// Unmodified config file
const config = jsonfile.readFileSync('config.json');

// Get List of all templates
let templates = glob.sync('./templates/*.js', {
    cwd: __dirname
});

// Get all template configs
let template = process.argv[process.argv.length - 1];
templates = templates.map(tmpl => require(tmpl)(config));


// Start Installation process
// 
console.log('Try to install template "' + template + '".');

// Look for the wanted template
let found = false;
templates.forEach((tmpl, index) => {
    if (tmpl.name === template) {
        found = index;
    }
});

// Cancel if template not found
if (found === false) {
    throw new Error('Invalid template name: Template with this name could not be found.');
}
template = templates[found];


// Install dependencies
template.install.dependencies.forEach((dep) => {
    execa.shellSync('npm install ' + dep + ' --save', {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit'
    });
});
console.log(('\n').repeat(5));

// Add scss files
config.paths.scss.files = template.scss.files.concat(config.paths.scss.files);
config.paths.scss.includePaths = config.paths.scss.includePaths.concat(template.scss.includePaths);

// Add js files
if (config.paths.js.files.length > 0) {
    config.paths.js.files[0] = template.js.files.concat(config.paths.js.files[0]);
}
else {
    config.paths.js.files.push(template.js.files);
}

// Add assets
config.paths.assets.files = config.paths.assets.files.concat(template.assets.files);


// Extend sourcefiles
template.install.files.forEach(append => {
    fs.appendFileSync(append.file, ("\n").repeat(5) + '// Lines added by the template' + "\n" + append.content);
    console.log('"' + append.file + '" has been modified!');
});

// Save JSON-File
jsonfile.writeFileSync('config.json', config, {spaces: 4});
console.log('Installation complete!');
