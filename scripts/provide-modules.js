const config 				= require('../config');
const emily 				= require('emily-cm');
const glob 					= require('glob');
const writeFileAtomicSync 	= require('write-file-atomic').sync;


/**
 * Provides the Emily Modules to the pug workfklow by
 * generating a modules.pug file in the set location with all
 * module includes
 */
module.exports = function(){
	let files = glob.sync(emily.config().path + '/**/*.pug');
	let depth = config.paths.pug.modules.replace(/(^\/|\/$)/g, '').split('/').length - 1;
	files = files.map((file)=>'include ' + ('../').repeat(depth) + file);
	writeFileAtomicSync(config.paths.pug.modules, files.join("\n"));	
}