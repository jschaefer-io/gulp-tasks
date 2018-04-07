
/**
 * Foundation-Sites Template
 * @type {Object}
 */
module.exports = function(config){
	return {
		name: 'jsio',
		install: {
			dependencies: [
				'normalize.css',
				'sff',
				'slim-query'
			],
			files: [
				{
					file: config.paths.scss.files[0],
					content: '@import "normalize";' + "\n" + '@import "sff";' + "\n" + '@include sff();'
				}
			]
		},
		scss: {
			files: [],
			includePaths: [
				'node_modules/normalize.css',
				'node_modules/sff/src'
			]
		},
		js: {
			files: [
				'node_modules/slim-query/dist/slimQuery.js',
			]
		},
		assets: {
			files: []
		}
	}
}