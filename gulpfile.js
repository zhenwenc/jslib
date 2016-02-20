'use strict'

const gulp    = require('gulp')
const filter  = require('gulp-filter')
const rimraf  = require('gulp-rimraf')
const notify  = require('gulp-notify')
const tsc     = require('gulp-typescript')
const mocha   = require('gulp-mocha')
const merge   = require('merge2')
const args    = require('yargs').argv

const project = tsc.createProject('tsconfig.json', {
  declaration: true
})

const mochaConfig = {
  reporter: 'spec',
  globals: {
    should: require('should')
  },
  bail: !!args.bail,
}

// ----------------------------------------------------------------------------

gulp.task('clean', () => {
  return gulp.src(['dist', 'lib', 'coverage'], { read: false })
    .pipe(rimraf())
})

gulp.task('build', ['clean'], () => {
  const compiled = project.src()
    .pipe(tsc(project))
    .on('error', onError)

  return merge([
    compiled.dts.pipe(gulp.dest('dist')),
    compiled.js.pipe(gulp.dest('dist')),
  ])
})

gulp.task('package', ['build', 'test'], () => {
  return gulp.src('dist/src/*')
    .pipe(gulp.dest('lib'))
})

gulp.task('test', (done) => {
  return gulp.src('dist/test/**/*.js', { read: false })
    .pipe(mocha(mochaConfig))
    .on('error', onError)
})

// ----------------------------------------------------------------------------

gulp.task('watch:build', ['build'], () => {
  gulp.watch(['src/**/*.{ts}'], ['build'])
})

gulp.task('watch:test', ['test'], () => {
  gulp.watch(['dist/src/**', 'dist/test/**'], ['test'])
})

gulp.task('watch', ['watch:build', 'watch:test'])

// ----------------------------------------------------------------------------

function onError(error) {
  notify.onError({
    title: error.name || 'Error',
    message: error.message || error || '',
  })
  console.log(error.stack)
  this.emit('end')
}
