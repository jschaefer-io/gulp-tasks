const jsonfile = require('jsonfile');
const emily = require('emily-cm');

let config = jsonfile.readFileSync('config.json');
try{
	let activeModules 	= emily.toPaths(emily.active());
	config.paths.scss.files 	= config.paths.scss.files.concat(activeModules.map((el)=>el+'*.scss'));
	config.paths.js.files[0]	= config.paths.js.files[0].concat(activeModules.map((el)=>el+'*.js'));
} catch(e){
	console.log('An error occurred while using emily-cm.');
}

module.exports = config;