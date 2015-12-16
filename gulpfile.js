'use strict'

const gulp    = require('gulp')
const args    = require('yargs').argv
const notify  = require('gulp-notify')
const mocha   = require('gulp-mocha')
const babel   = require('gulp-babel')

require('babel-register')

function onError(error) {
  var message = error.message || error || ''
  if (error.filename) {
    message += '\n' + error.filename.replace(process.cwd(), '')
    if (error.location) {
      message += ':' + error.location.first_line +
                 ':' + error.location.first_column
    }
  }
  notify.onError({
    title: error.name || 'Error',
    message: message,
  })
  console.log(error.stack)
  this.emit('end')
}

gulp.task('clean', () => {
  return gulp.src(['lib', 'dist', 'coverage'], { read: false })
    .pipe(rimraf())
})

gulp.task('build:lib', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0', 'react'],
    }))
    .on('error', onError)
    .pipe(gulp.dest('lib'))
})

gulp.task('build', ['build:lib'])

gulp.task('test', () => {
  return gulp.src('test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should'),
      },
      bail: !!args.bail,
    }))
    .on('error', onError)
})

gulp.task('watch:build', ['build'], () => {
  gulp.watch(['src/**'], ['build'])
})

gulp.task('watch:test', ['build', 'test'], () => {
  gulp.watch(['lib/**', 'test/**'], ['test'])
})

gulp.task('watch', ['watch:build', 'watch:test'])
