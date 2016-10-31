'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const packager = require('electron-packager');
const path = require('path');
const install = require('gulp-install');
const zip = require('gulp-zip');
const electronInstaller = require('electron-winstaller');
const fs = require('fs');
const del = require('del');
const replace = require('gulp-replace');
const appPkg = require('./app/package.json');

gulp.task('deps', () => {
  return gulp.src('./app/package.json')
    .pipe(install({ production: true }));
});

gulp.task('clean:renderer', () => {
  return del(['./app/renderer']);
});

gulp.task('renderer', ['deps', 'clean:renderer'], () => {
  const js = gulp.src('./app/renderer-jsx/**/*.js*')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/renderer'));
  return js;
});


function build(arch) {
  return new Promise((resolve, reject) => {
    packager({
      arch,
    })
  })
}


gulp.task('build', ['renderer', 'deps'], () => {
  return build('ia32')
    .then(() => build('x64'));
});


gulp.task('build-zip-ia32', ['build'], () => buildZip('ia32'));
gulp.task('build-zip-x64', ['build'], () => buildZip('x64'));
gulp.task('build-zip', ['build-zip-ia32', 'build-zip-x64']);

gulp.task('build-installer', ['build', 'build-zip'], () => {
  return buildInstaller('ia32')
    .then(() => buildInstaller('x64'));
});


gulp.task('build-chocolatey', () => {
  return gulp.src('./chocolatey/**/*')
    .pipe(replace('${version}', appPkg.version))
    .pipe(gulp.dest('./out/chocolatey/'));
});


gulp.task('build-all', ['build-zip', 'build-installer', 'build-chocolatey']);

gulp.task('watch', ['renderer'], () => {
  const opts = {
    debounceDelay: 2000
  };
  gulp.watch('./app/renderer-jsx/**/*', opts, ['renderer']);
});


gulp.task('default', ['renderer']);


