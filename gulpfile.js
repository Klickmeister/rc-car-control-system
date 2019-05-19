// ToDo: Create gulp tasks from functions and add propper termination (2)
'use strict';

// Load plugins
const config = require('./config.js');
const nodemon = require('gulp-nodemon');
const browsersync = require('browser-sync').create();
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

// Starting the webserver
function server() {
  let started = false;
  return nodemon({
    script: 'server.js',
    watch: ['server.js', 'models', 'routes']
  }).on('start', function () {
    if (!started) {
      started = true;
    }
    browsersync.stream();
  });
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    proxy : 'https://localhost:3000',
    open: false,
    cors: true,
    port : 3001,
    https: {
      key: config.ssl.key,
      cert: config.ssl.cert,
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Transpile, concatenate and minify CSS
function css() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      errLogToConsole : true,
      sourceComments: 'map'
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browsersync.stream());
}

// Transpile, concatenate and minify scripts
function js() {
  return (
    gulp
      .src(['./src/js/**/*'])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('script.js'))
      .pipe(minify({
        ext:{
          min:'.min.js'
        },
        noSource: true
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/js/'))
      .pipe(browsersync.stream())
  );
}

// Watch files
function watchFiles() {
  gulp.watch('./src/scss/**/*', css);
  gulp.watch('./src/js/**/*', js);
  gulp.watch(
    [
      './views/**/*',
      './routes/**/*',
      './models/**/*',
      './helpers/**/*',
    ],
    gulp.series(browserSyncReload)
  );
}

// Defining complex tasks
const build = gulp.parallel(css, js);
const watch = gulp.parallel(watchFiles, server, browserSync);

// Exporting tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = build;
