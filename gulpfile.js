'use strict'

var gulp       = require('gulp')
var babel      = require('gulp-babel')
var filter     = require('gulp-filter')
var flatten    = require('gulp-flatten')
var preprocess = require('gulp-preprocess')
var rimraf     = require('gulp-rimraf')
var notify     = require('gulp-notify')
var tsc        = require('gulp-typescript')
var mocha      = require('gulp-mocha')
var glob       = require('tsconfig-glob')
var merge      = require('merge2')
var args       = require('yargs').argv

var project = tsc.createProject('tsconfig.json')

var mochaConfig = {
  reporter: 'dot', // spec
  bail: !!args.bail,
}

// ----------------------------------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(['dist', 'lib', 'coverage'], { read: false })
    .pipe(rimraf())
})

gulp.task('prebuild', function() {
  return glob({
    configPath: '.',
    cwd: process.cwd(),
    indent: 2,
  })
})

gulp.task('build', ['clean', 'prebuild'], function(done) {
  var compiled = project.src()
    .pipe(tsc(project))
    .on('error', onError)

  return merge([
    compiled.dts.pipe(gulp.dest('dist')),
    compiled.js.pipe(gulp.dest('dist')),
  ])
})

gulp.task('package', ['build', 'test'], function(done) {
  var scripts = gulp.src('dist/src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
  var typings = gulp.src('dist/src/**/*.d.ts')
  var customs = gulp.src('src/**/*-ext.d.ts').pipe(flatten())

  return merge([
    scripts.pipe(gulp.dest('lib')),
    typings.pipe(gulp.dest('lib')),
    customs.pipe(gulp.dest('lib')),
  ])
})

gulp.task('test', ['build'], function(done) {
  return gulp.src('dist/test/**/*\.spec\.js', { read: false })
    .pipe(mocha(mochaConfig))
    .on('error', onError)
})

// ----------------------------------------------------------------------------

gulp.task('watch:build', ['build'], function() {
  gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['build'])
})

gulp.task('watch:test', ['test'], function() {
  gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['test'])
})

// ----------------------------------------------------------------------------

function onError(error) {
  notify.onError({
    title: error.name || 'Error',
    message: error.message || error || '',
  })
  console.log(error.stack)
  this.emit('end')
}
