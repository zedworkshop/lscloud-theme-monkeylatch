'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var wiredep = require('wiredep').stream;

// load plugins
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'uglify-save-license', 'main-bower-files'],
    camelize: true
});

var paths = {
    dev: './src',
    build: './resources'
};

// load options
var bumpType = $.util.env.type || 'patch';

gulp.task('styles', function() {
    $.util.log('Rebuilding application styles');

    return gulp.src(paths.dev + '/scss/*.scss')
        .pipe($.plumber())
        .pipe($.sass({
            includePaths: [paths.dev + '/bower_components'],
            sourcemap: true,
            errLogToConsole: true,
            onError: browserSync.notify
        }))
        .pipe($.autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe($.pixrem(undefined, {
            atrules: true
        }))
        .pipe(gulp.dest(paths.dev + '/css'))
        .pipe($.size({
            showFiles: true
        }))
        .pipe($.filter('**/*.css'))
        .pipe(reload({
            stream: true
        }))
        .pipe($.notify('CSS compiled and autoprefixed'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.dev + '/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size())
        .on('error', $.util.log)
        .pipe($.notify('JS hinted'));
});

gulp.task('html', ['styles'], function() {
    var jsFilter = $.filter('js/*.js');
    var cssFilter = $.filter('css/*.css');
    var assets = $.useref.assets();

    return gulp.src(paths.dev + '/build.html')
        .pipe(assets)
        .pipe(jsFilter)
        .pipe($.uglify({
            preserveComments: $.uglifySaveLicense
        }))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.cssmin())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(paths.build))
        .pipe($.size())
        .pipe($.notify('CSS and JS concatted and minified'));
});

gulp.task('images', function() {
    return gulp.src(paths.dev + '/img/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.build + '/img'))
        .pipe($.size())
        .pipe($.notify('Images minified'));
});

gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.build + '/fonts'))
        .pipe($.size());
});

gulp.task('copy', function() {
    return gulp.src([
            paths.dev + '/favicon.ico'
        ])
        .pipe(gulp.dest(paths.build));
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: paths.dev
        }
    });
});

gulp.task('watch', ['styles', 'serve'], function() {

    // watch for changes to reload
    gulp.watch([
        paths.dev + '/*.html',
        paths.dev + '/js/**/*.js',
        paths.dev + '/images/**/*'
    ], {}, reload);

    // watch to run tasks
    gulp.watch(paths.dev + '/scss/**/*', ['styles']);
});

gulp.task('build', ['html', 'images', 'fonts', 'copy']);

gulp.task('bower', function() {
    gulp.src(paths.dev + '/build.html')
        .pipe(wiredep({
            exclude: [

            ]
        }))
        .pipe(gulp.dest(paths.dev));
});

// Update bower, component, npm at once:
gulp.task('bump', function() {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump({
            type: bumpType
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('email', function() {
    gulp.src(paths.dev + '/email/*.html')
        .pipe($.premailer())
        .pipe(gulp.dest(paths.build + '/email/'));
});
