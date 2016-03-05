import gulp from 'gulp'
import util from 'gulp-util'
import babel from 'gulp-babel'

var dest_dir = 'dest/';

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
  gulp.watch(['./src/**/*'], ['compile-js']);
});

gulp.task('manifest', () => {
  gulp.src('src/manifest.json')
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

gulp.task('default', ['watch', 'compile-js', 'manifest', 'resources', 'vendor']);
