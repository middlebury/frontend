import fs from 'fs';
import gulp from 'gulp';
import twig from 'gulp-twig';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import data from 'gulp-data';
import notify from 'gulp-notify';
import eslint from 'gulp-eslint';
import yaml from 'js-yaml';
import del from 'del';
import babelify from 'babelify';
import beeper from 'beeper';
import { argv as args } from 'yargs';

const production = !!args.production;

const paths = {
  html: {
    src: './src/templates/**/*.twig',
    dest: './dist'
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './dist/css/'
  },
  scripts: {
    // TODO: make this so browserify can process multiple files
    src: './src/js/**/*.js',
    dest: './dist/js/'
  },
  }
};

const onError = function(err) {
  notify.onError({
    title: 'Gulp error in ' + err.plugin,
    message: err.toString()
  })(err);
  beeper();
  this.emit('end');
};

gulp.task('clean', () => {
  return del([
    './dist/**/*'
  ]);
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: false,
    directory: true
  });
});

gulp.task('styles', () => {
  gulp.src(paths.styles.src)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({
      onError: browserSync.notify
    })).on('error', sass.logError)
    .pipe(autoprefixer(['> 2%', 'last 2 versions']))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
});

gulp.task('scripts:lint', () => {
  return gulp.src(paths.scripts.src)
    .pipe(eslint())
    .pipe(eslint.format());
})

gulp.task('scripts', function() {
  var b = browserify({
    entries: './src/js/main.js',
    debug: true,
    transform: [[babelify, { presets: ['es2015'] }]]
  });

  return b.bundle()
    .on('error', function(err) {
      console.error(err.message);
      beeper();
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
});

gulp.task('html', () => {
  gulp.src(paths.html.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(data(function(file) {
      // TODO: how to import a glob?
      return yaml.safeLoad(fs.readFileSync('./src/data/data.yml', 'utf8'));
    }))
    .pipe(twig({
      base: './src/templates',
    }))
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('watch', () => {
  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.scripts.src, ['scripts', 'scripts:lint']);
});

gulp.task('build', ['clean', 'html', 'styles', 'scripts:lint', 'scripts']);

gulp.task('default', ['build', 'watch', 'server']);
