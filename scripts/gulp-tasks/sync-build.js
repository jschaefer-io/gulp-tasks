const browserSync = require('browser-sync');

/**
 * gulp browser sync task
 **/
module.exports = {
    before: ['scripts', 'styles', 'assets', 'views'],
    task: () => {
        const sync = browserSync.get('Web-Tasks Sync');
        sync.reload();
        console.log('reload');
    }
};