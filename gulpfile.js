const dotenv = require('dotenv');
const fs = require('fs');
const gulp = require('gulp');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const data = require('gulp-data');
const notify = require('gulp-notify');
const eslint = require('gulp-eslint');
const prettify = require('gulp-prettify');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');
const yaml = require('js-yaml');
const del = require('del');
const beeper = require('beeper');
const args = require('yargs').argv;
const svgSprites = require('gulp-svg-sprites');
const gulpIf = require('gulp-if');
const cmq = require('gulp-combine-mq');
const size = require('gulp-size');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssUrl = require('postcss-url');

const rollup = require('./rollup.config');

dotenv.config();

const production = !!args.production;

const paths = {
  html: {
    src: './src/templates/*.twig',
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
  images: {
    src: './src/images/*.{png,jpg,svg}',
    dest: './dist/images/'
  }
};

/**
 * Change output paths if --themeDir is passed.
 *
 * This is so frontend can be iterated on and continuously ouput
 * to a Drupal theme (helpful for frontend changes on dev server).
 *
 * Use `gulp dev` in conjunction with this so browser sync server is not started.
 */

const { THEME_DIR } = process.env;

if (!production && THEME_DIR) {
  console.log(`outputing assets into theme_dir`, THEME_DIR);
  paths.styles.dest = THEME_DIR + '/css/';
  paths.scripts.dest = THEME_DIR + '/js/';
  paths.images.dest = THEME_DIR + '/images/';
}

const onError = function(err) {
  notify.onError({
    title: 'Gulp error in ' + err.plugin,
    message: err.toString()
  })(err);
  beeper();
  this.emit('end');
};

gulp.task('clean', done => {
  return del(
    [
      './dist/**/*.html',
      './dist/**/*.js',
      './dist/**/*.css',
      './dist/images/*'
    ],
    done
  );
});

gulp.task('server', () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: './dist'
    },
    open: false,
    directory: true
  });
});

gulp.task('icons', () => {
  return gulp
    .src('./src/images/icon-*.svg')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(
      svgSprites({
        mode: 'symbols'
      })
    )
    .pipe(gulp.dest('./dist/icons'));
});

gulp.task('copy:icons', () => {
  return gulp
    .src('./dist/icons/svg/symbols.svg')
    .pipe(rename('icons.twig'))
    .pipe(gulp.dest('./src/templates/partials'));
});

const hash = Date.now();

gulp.task('styles', () => {
  let plugins = [
    autoprefixer(),
    postcssUrl({
      url({ url }) {
        return url + '?fv=' + hash;
      }
    })
  ];

  if (production) {
    plugins.push(cssnano());
  }

  return gulp
    .src(paths.styles.src)
    .pipe(gulpIf(!production, sourcemaps.init({ loadMaps: true })))
    .pipe(
      sass({
        onError: browserSync.notify
      })
    )
    .on('error', sass.logError)
    .pipe(gulpIf(production, cmq()))
    .pipe(postcss(plugins))
    .pipe(gulpIf(!production, sourcemaps.write('./')))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
});

gulp.task('scripts:lint', () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', () => {
  return rollup({
    input: './src/js/index.js',
    file: './dist/js/bundle.js'
  }).then(() => browserSync.reload());
});

gulp.task('html', () => {
  gulp
    .src(paths.html.src)
    .pipe(
      plumber({
        errorHandler: onError
      })
    )
    .pipe(
      data(function(file) {
        // TODO: how to import a glob?
        const yml = yaml.safeLoad(
          fs.readFileSync('./src/data/data.yml', 'utf8')
        );
        const programs = yaml.safeLoad(
          fs.readFileSync('./src/data/programs.yml', 'utf8')
        );

        return Object.assign({}, yml, programs, {
          imagesDir: args.imagesDir || '',
          env: {
            production
          }
        });
      })
    )
    .pipe(
      twig({
        base: './src/templates'
      })
    )
    .pipe(prettify())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp
    .src(paths.images.src)
    .pipe(
      imagemin([
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { removeDimensions: true },
            { cleanupIDs: false }
          ]
        })
      ])
    )
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  gulp.watch('./src/templates/**/*.twig', ['html']);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.images.src, ['images']);
  gulp.watch(paths.scripts.src, ['scripts']);
  gulp.watch('./src/data/*.yml', ['html']);
});

gulp.task('replace:imageurls', () => {
  const imagesDir = args.imagesDir || '/images/';
  return gulp
    .src('./dist/css/*.css')
    .pipe(replace('/images/', imagesDir))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy:deps', function() {
  // NOTE: Chart.bundle.min.js includes Momentjs but so far we are not using time axis
  // http://www.chartjs.org/docs/latest/getting-started/installation.html#bundled-build
  gulp
    .src(['./node_modules/chart.js/dist/Chart.min.js'])
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('deploy', ['replace:imageurls'], () => {
  const dest = args.themeDir || '';
  if (!args.themeDir) {
    return console.error('No `--themeDir` argument passed'); // eslint-disable-line no-console
  }
  return gulp
    .src(
      [
        './dist/css/main.css',
        './dist/js/bundle.js',
        './dist/js/Chart.min.js',
        './dist/images/*'
      ],
      {
        base: './dist'
      }
    )
    .pipe(gulp.dest(dest));
});

gulp.task('build', [
  'clean',
  'html',
  'images',
  'styles',
  'scripts',
  'copy:deps'
]);

gulp.task('dev', ['build', 'watch']);

gulp.task('default', ['build', 'watch', 'server']);
