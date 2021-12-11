const {src, dest, series} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const jsmin = require('gulp-jsmin');

function pagesTask() {
  return src('src/*.html')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/'));
}

function stylesTask() {
  return src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/'));
}

function scriptsTask() {
  return src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(jsmin())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/'));
}

exports.default = series(pagesTask, stylesTask, scriptsTask);