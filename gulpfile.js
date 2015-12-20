'use strict'

const gulp   = require('gulp')
const rimraf = require('gulp-rimraf')
const notify = require('gulp-notify')
const tsc    = require('gulp-typescript')
const mocha  = require('gulp-mocha')
const args   = require('yargs').argv

function onError(error) {
  notify.onError({
    title: error.name || 'Error',
    message: error.message || error || '',
  })
  console.log(error.stack)
  this.emit('end')
}

const paths = {
  lib: {
    all:  './src/**/*.{ts,js}',
    dest: './lib'
  },
  test: {
    all:  './test/**/*.{ts,js}',
    dest: './dist/test'
  },
}

const mainProject = tsc.createProject(
  'src/tsconfig.json', {
    noExternalResolve: true
  })

const testProject = tsc.createProject(
  'test/tsconfig.json', {
    noExternalResolve: true
  })

const mochaConfig = {
  reporter: 'spec',
  globals: {
    should: require('should')
  },
  bail: !!args.bail,
}

// ----------------------------------------------------------------------------
// Clean

gulp.task('clean', () => {
  return gulp.src(['dist', 'lib', 'coverage'], { read: false })
    .pipe(rimraf())
})

// ----------------------------------------------------------------------------
// Build Source

gulp.task('build:lib', () => {
  return mainProject.src()
    .pipe(tsc(mainProject))
    .on('error', onError)
    .pipe(gulp.dest('lib'))
})

gulp.task('build', ['clean', 'build:lib'])

// ----------------------------------------------------------------------------
// Build and Run Test

gulp.task('build:test', () => {
  return testProject.src()
    .pipe(tsc(testProject))
    .on('error', onError)
    .pipe(gulp.dest('dist/test'))
})

gulp.task('test', (done) => {
  return gulp.src('./dist/test/**/*.js', { read: false })
    .pipe(mocha(mochaConfig))
    .on('error', onError)
})

// ----------------------------------------------------------------------------
// Watch

gulp.task('watch:build', ['build'], () => {
  gulp.watch(['src/**/*.{ts}'], ['build'])
})

gulp.task('watch:test', ['test'], () => {
  gulp.watch(['lib/**', 'dist/test/**'], ['test'])
})

gulp.task('watch', ['watch:build', 'watch:test'])
