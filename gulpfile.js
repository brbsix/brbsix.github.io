var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    browserSync = require('browser-sync'),
    path = require('path');

var assets = 'assets/'
    vendor = assets + 'vendor/',

    srcCSS = 'css/',
    srcJS = 'js/',

    dstCSS = assets + 'css/'
    dstJS = assets + 'js/'

    bowerBase = 'bower_components/',

    root = '',
    deploy = '_site/';

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles(), { base: bowerBase })
        .pipe(gulp.dest(vendor));
});


gulp.task('jekyll', ['bower'], function (gulpCallBack){
    var spawn = require('child_process').spawn;

    // After build: cleanup HTML
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    });
});


gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: deploy
        }
    });
});


gulp.task('default', ['bower', 'jekyll', 'browser-sync'], function() {
    // --> CSS
    gulp.watch(dstCSS + "**", ['jekyll']);

    // --> JS
    gulp.watch(dstJS + "*.js", ['jekyll']);

    // --> Vendor packages
    gulp.watch(bowerBase + "**", ['jekyll']);

    // --> HTML
    gulp.watch([
        path.join(root, '*.html'),
        path.join(root, '*.md'),
        path.join(root, '_layouts/*.html'),
        path.join(root, '_includes/*.html'),
        path.join(root, '_drafts/*,md'),
        path.join(root, '_posts/*.md'),
        path.join(root, '_config.yml')
    ], ['jekyll']);

    // --> Ruby
    //gulp.watch(path.join(dist, '*/*.rb'), ['jekyll']);
});
