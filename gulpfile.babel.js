import gulp from 'gulp'
import util from 'gulp-util'
import babel from 'gulp-babel'
import zip from 'gulp-zip'
import jeditor from 'gulp-json-editor'

import fs from 'fs'

const dest_dir = 'dest/';
const version = (() => {
  const json = JSON.parse(fs.readFileSync('./package.json'));
  return json.version;
})();
const name = (() => {
  const json = JSON.parse(fs.readFileSync('./package.json'));
  return json.name;
})();

gulp.task('compile-js', () => {
  gulp.src("./src/**/*.{js,jsx}")
    .pipe(babel())
    .on('error', (err) => {
      util.log(
        util.colors.red('Error'),
        `${err.message}\n${err.codeFrame}`
      );
      gulp.emit('end');
    })
    .pipe(gulp.dest(dest_dir));
});


gulp.task('watch', () => {
  gulp.watch(['./src/**/*'], ['build']);
});


gulp.task('manifest', () => {
  return gulp.src('src/manifest.json')
    .pipe(jeditor({ version: version }))
    .pipe(gulp.dest(dest_dir));
});
gulp.task('vendor', () => {
  gulp.src('vendor/*')
    .pipe(gulp.dest(dest_dir));
});

gulp.task('resources', () => {
  gulp.src('resources/*')
    .pipe(gulp.dest(dest_dir + 'resources'));
});

gulp.task('zip', ['build'], function (cb) {
  return gulp.src('dest/**/*')
      .pipe(zip(`${name}-${version}.zip`))
      .pipe(gulp.dest('build'));
})

gulp.task('build', ['compile-js', 'manifest', 'resources', 'vendor']);

gulp.task('default', ['watch', 'build']);
