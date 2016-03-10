import gulp from 'gulp'
import util from 'gulp-util'
import babel from 'gulp-babel'
import zip from 'gulp-zip'
import del from 'del'
import fs from 'fs'
import jeditor from 'gulp-json-editor'
import runSequence from 'run-sequence'
// import rename from 'gulp-rename'
// import uglify from 'gulp-uglify'


const dist_dir = './dist/';
const version = (() => {
  const json = JSON.parse(fs.readFileSync('package.json'));
  return json.version;
})();
const name = (() => {
  const json = JSON.parse(fs.readFileSync('package.json'));
  return json.name;
})();

gulp.task('compile-js', () => {
  gulp.src("src/**/*.{js,jsx}")
    .pipe(babel())
    .on('error', (err) => {
      util.log(
        util.colors.red('Error'),
        `${err.message}\n${err.codeFrame}`
      );
      gulp.emit('end');
    })
    .pipe(gulp.dest(dist_dir));
});


gulp.task('watch', () => {
  gulp.watch(['src/**/*', 'resources/**/*'], ['build']);
});


gulp.task('manifest', () => {
  return gulp.src('src/manifest.json')
    .pipe(jeditor({ version: version }))
    .pipe(gulp.dest(dist_dir));
});
gulp.task('vendor', () => {
  gulp.src('vendor/*')
    .pipe(gulp.dest(dist_dir));
});

gulp.task('resources', () => {
  gulp.src('resources/*')
    .pipe(gulp.dest(dist_dir + 'resources'));
});

gulp.task('clean', () => {
  del.sync(['dist/**/*']);
});
  // due to prevent 'Error: EEXIST: file already exists'
gulp.task('pack', () => {
  runSequence('clean',
    'build',
    'zip'
  );
});

gulp.task('zip', ['build'], function (cb) {
  return gulp.src('dist/**/*')
      .pipe(zip(`${name}-${version}.zip`))
      .pipe(gulp.dest('build'));
})

gulp.task('build', ['compile-js', 'manifest', 'resources', 'vendor']);

gulp.task('default', ['watch', 'build']);
