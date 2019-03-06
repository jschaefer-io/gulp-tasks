/**
 * Bootstrap Template
 * @type {Object}
 */
module.exports = function (config){
    return {
        name: 'bootstrap',
        install: {
            dependencies: [
                'bootstrap',
                'jquery'
            ],
            files: [
                {
                    file: config.paths.scss.files[0],
                    content: '@import "bootstrap";'
                }
            ]
        },
        scss: {
            files: [],
            includePaths: [
                'node_modules/bootstrap/scss'
            ]
        },
        js: {
            files: [
                'node_modules/jquery/dist/jquery.js',
                'node_modules/bootstrap/dist/js/bootstrap.js'
            ]
        },
        assets: {
            files: []
        }
    }
};