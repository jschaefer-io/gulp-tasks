/**
 * Foundation-Sites Template
 * @type {Object}
 */
module.exports = function (config){
    return {
        name: 'foundation',
        install: {
            dependencies: [
                'foundation-sites',
                'jquery'
            ],
            files: [
                {
                    file: config.paths.scss.files[0],
                    content: '@import "settings/settings";' + "\n" + '@import "foundation";' + "\n" + '@include foundation-everything;'
                }
            ]
        },
        scss: {
            files: [],
            includePaths: [
                'node_modules/foundation-sites/scss'
            ]
        },
        js: {
            files: [
                'node_modules/jquery/dist/jquery.js',
                'node_modules/foundation-sites/dist/js/foundation.js'
            ]
        },
        assets: {
            files: []
        }
    }
};