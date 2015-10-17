'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var mainBowerFiles = require('main-bower-files');

var LessPluginCleanCSS = require("less-plugin-clean-css"),
    cleancss = new LessPluginCleanCSS({advanced: true});

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

gulp.task('css:big', function() {
    return gulp.src('css/picker.less')
        .pipe(plugins.less({
            plugins: [autoprefix]
        }))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.rename('picker.css'))
        .pipe(gulp.dest('css/'))
        .pipe(plugins.notify('CSS build finished'));
});

gulp.task('css:min', function() {
    return gulp.src('css/picker.less')
        .pipe(plugins.less({
            plugins: [autoprefix, cleancss]
        }))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.rename('picker.min.css'))
        .pipe(gulp.dest('css/'))
        .pipe(plugins.notify('CSS:mini build finished'));
});

gulp.task('js:min', function() {
    return gulp.src('js/picker.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('picker.min.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('examples:js', function() {
    return gulp.src(mainBowerFiles({'includeDev': true}))
        .pipe(plugins.ignore.include('*.js'))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.concat('libs.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('examples/js/'));
});

gulp.task('examples:css', function() {
    return gulp.src('examples/css/main.less')
        .pipe(plugins.less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(plugins.addSrc.prepend(mainBowerFiles()))
        .pipe(plugins.ignore.include('*.css'))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('examples/css/'));
});

gulp.task('css', ['css:big', 'css:min']);
gulp.task('examples', ['examples:css', 'examples:js']);

gulp.task('build', ['examples', 'css', 'js:min']);

gulp.task('default', ['css'], function() {
    gulp.watch('css/picker.less', ['css:big']);
});