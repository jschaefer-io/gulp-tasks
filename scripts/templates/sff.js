/**
 * sff base
 * @type {Object}
 */
module.exports = function (config){
    return {
        name: 'sff',
        install: {
            dependencies: [
                'normalize.css',
                'sff'
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
            files: []
        },
        assets: {
            files: []
        }
    }
};