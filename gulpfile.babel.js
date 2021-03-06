import gulp from 'gulp'
import util from 'gulp-util'
import babel from 'gulp-babel'
import zip from 'gulp-zip'
import plumber from "gulp-plumber"
import inject from 'gulp-inject'
import mainBowerFiles from 'main-bower-files'
import del from 'del'
import fs from 'fs'
import browserify from "browserify"
import babelify from "babelify"
import through2 from 'through2'
import jeditor from 'gulp-json-editor'
import runSequence from 'run-sequence'
import webserver from 'gulp-webserver'
import uglify from 'gulp-uglify'
// import rename from 'gulp-rename'

const path_map = {
  dest_dir: './dist/',
};
const version = (() => {
  const json = JSON.parse(fs.readFileSync('package.json'));
  return json.version;
})();
const name = (() => {
  const json = JSON.parse(fs.readFileSync('package.json'));
  return json.name;
})();

gulp.task('babelify', () => {
  gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(through2.obj((file, encode, callback) => {
      browserify(file.path, { debug: true })
        .transform(babelify)
        .bundle((err, res) => {
        if (err) { return callback(err); }
        file.contents = res;
        callback(null, file);
      }).on("error", (err) => {
        util.log(
          util.colors.red('Error'),
          `${err.message}\n${err.codeFrame}`
        );
      });
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path_map.dest_dir));
});

gulp.task('babel', () => {
  gulp.src("src/**/*.{js,jsx}")
    .pipe(babel())
    .on('error', (err) => {
      util.log(
        util.colors.red('Error'),
        `${err.message}\n${err.codeFrame}`
      );
      gulp.emit('end');
    })
    .pipe(gulp.dest(path_map.dest_dir));
});

gulp.task('manifest', () => {
  return gulp.src('src/manifest.json')
    .pipe(jeditor({
      version: version,
      name: name
    }))
    .pipe(gulp.dest(path_map.dest_dir));
});

gulp.task('resources', () => {
  gulp.src('resources/*')
    .pipe(gulp.dest(`${path_map.dest_dir}/resources`));
});

gulp.task('vendor', (cb) => {
    gulp.src(mainBowerFiles())
    .pipe(gulp.dest(`${path_map.dest_dir}/vendor`));
    cb();
});

gulp.task('inject', ['vendor'], () => {
  gulp.src('src/**/*.html')
    .pipe(inject(gulp.src(mainBowerFiles()), {
      transform: (filepath, file, index, length, targetFile) => {
        return inject.transform(`./vendor/${file.relative}`);
      }
    }))
    .pipe(gulp.dest(path_map.dest_dir));
});

gulp.task('webserver', () => {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});
gulp.task('watch-webserver', ['watch', 'webserver']);

gulp.task('clean', () => {
  // due to prevent 'Error: EEXIST: file already exists'
  del.sync(['dist/**/*']);
});

// FIXME: does not work correct order
gulp.task('pack', (cb) => {
  runSequence('clean',
    'build',
    'zip',
    cb);
});

gulp.task('zip', function (cb) {
  return gulp.src('dist/**/*')
      .pipe(zip(`${name}-${version}.zip`))
      .pipe(gulp.dest('build'));
})

gulp.task('watch', () => {
  gulp.watch(['src/**/*', 'resources/**/*'], ['build']);
});

gulp.task('build', ['babelify', 'manifest', 'resources', 'inject']);

gulp.task('default', ['watch', 'build']);
