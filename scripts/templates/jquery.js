/**
 * jQuery Template
 * @type {Object}
 */
module.exports = function (config){
    return {
        name: 'jquery',
        install: {
            dependencies: [
                'jquery'
            ],
            files: []
        },
        scss: {
            files: [],
            includePaths: []
        },
        js: {
            files: [
                'node_modules/jquery/dist/jquery.js'
            ]
        },
        assets: {
            files: []
        }
    }
};