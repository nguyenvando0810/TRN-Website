const stripDebug = require('gulp-strip-debug');

// generated on 2017-03-27 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const argv = require('minimist')(process.argv.slice(2));
const processhtml = require('gulp-processhtml');
const tap = require('gulp-tap');
const path = require('path');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');

const handlebarsHelper = require('./handlebars-helper.js');
const helpers = require('handlebars-helpers')();

var Dir = 'nav-site/';
var envDir = './_env/';
var distDir = 'dist/';

var jsConfigPath = '';
var scssConfigPath = '';
var templatesConfig = {};

// arguments for environment
if (['localhost', 'staging', 'production'].indexOf(argv.env) > -1) {
  jsConfigPath = envDir + argv.env + '/scripts/';
  scssConfigPath = envDir + argv.env + '/styles/';
  templatesConfig.data = envDir + argv.env + '/templates/';
} else {
  jsConfigPath = envDir + 'scripts/localhost/data.js';
  scssConfigPath = envDir + 'localhost/styles/';
  templatesConfig.data = envDir + 'localhost/templates/';
}

// templates to build - currently only one, no other variations required
templatesConfig.src = './source/templates/pages/';
templatesConfig.dest = 'default/';

const contentDataPath = './source/contents/data/';

gulp.task('handlebars', function() {
  const templateData = require(`./${templatesConfig.data}data.json`);

  templateData.header = require(`./${contentDataPath}header.json`);
  templateData.footer = require(`./${contentDataPath}footer.json`);

  const options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ['./source/templates/partials', './source/templates/layouts'],
    helpers: handlebarsHelper
  };

  const outputDir = `.tmp/${templatesConfig.dest}`;

  return gulp.src('source/contents/*.json')
    .pipe(tap((file) => {
      const fileName = path.basename(file.path);
      const contentJson = require(file.path);
      const templateFile = contentJson.layout.template;
      const pageLocation = `${outputDir}${path.dirname(contentJson.sitemap.loc)}`;
      const htmlFileName = path.parse(path.basename(contentJson.sitemap.loc)).name;
      const contentData = {
        settings: contentJson.settings,
        contents: contentJson.contents,
        data: templateData,
      };

      gulp.src(`${templatesConfig.src}${templateFile}`)
        .pipe(handlebars(contentData, options))
        .pipe(rename(`${htmlFileName}.html`))
        .pipe(gulp.dest(pageLocation));

      return gulp;
    }));
});


gulp.task('styles', () => {
  return gulp.src('./source/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.', scssConfigPath]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/' + templatesConfig.dest + 'styles'))
     // TODO remove this after finish build integration
    .pipe(gulp.dest('../server/source/wp-content/themes/AFF/assets/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('styles:dist', () => {
  return gulp.src('./source/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'compressed',
      precision: 10,
      includePaths: ['.', scssConfigPath]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(gulp.dest('.tmp/' + templatesConfig.dest + 'styles'))
    .pipe(reload({stream: true}));
});


gulp.task('scripts', () => {
  return gulp.src([jsConfigPath+'data.js', './source/scripts/*.js'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/'+ templatesConfig.dest +'scripts'))
    // TODO remove this after finishing build integration
    .pipe(gulp.dest(`../server/source/wp-content/themes/AFF/assets/scripts`))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
appendFile}

gulp.task('lint', () => {
  // return lint('./source/scripts/**/*.js', {
  //   fix: true
  // })
  //   .pipe(gulp.dest('./source/scripts'));
});

gulp.task('html', ['handlebars', 'libs', 'styles', 'scripts'], () => {
  return gulp.src('.tmp/'+ templatesConfig.dest +'/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'source', '.']}))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe(gulp.dest('.tmp/' + templatesConfig.dest));
});

gulp.task('html:dist', ['handlebars', 'libs', 'styles:dist', 'scripts'], () => {
  return gulp.src('.tmp/'+ templatesConfig.dest +'/*.html')
    .pipe(processhtml({}))
    .pipe($.useref({searchPath: ['.tmp', 'source', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.stripDebug()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe(gulp.dest('.tmp/' + templatesConfig.dest));
});

gulp.task('images', () => {
  return gulp.src('./source/images/**/*')
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true,
    //   // don't remove IDs from SVGs, they are often used
    //   // as hooks for embedding and styling
    //   svgoPlugins: [{cleanupIDs: false}]
    // })))
    .pipe(gulp.dest('.tmp/'+ templatesConfig.dest +'images'));
});

gulp.task('videos', () => {
  return gulp.src('./source/videos/**/*')
    .pipe(gulp.dest('.tmp/'+ templatesConfig.dest +'videos'));
});


gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('./source/fonts/**/*'))
    .pipe(gulp.dest('.tmp/'+ templatesConfig.dest +'fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    './source/*.*',
    '!./source/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('.tmp/' + templatesConfig.dest));
});

gulp.task('clean', del.bind(null, ['.tmp/', distDir ]));


// create a task that ensures the `handlebars` task is complete before
// reloading browsers
gulp.task('handlebar-watch', ['handlebars'], function(done) {
  browserSync.reload();
  done();
});


gulp.task('serve', ['handlebars', 'libs', 'images', 'videos', 'styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', '.tmp/' + templatesConfig.dest],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch([
    './source/templates/pages/**/*',
    './source/templates/partials/*',
    './source/images/**/*'
  ], ['handlebar-watch']);


  gulp.watch('./source/**/*', ['handlebars', 'styles', 'scripts'])
  gulp.watch('./source/styles/**/*.scss', ['styles']);
  gulp.watch('./source/scripts/**/*.js', ['scripts']);
  gulp.watch('./source/fonts/**/*', ['fonts']);
  gulp.watch('./source/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', ['build'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist/' + templatesConfig.dest]
    }
  });
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('./source/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('./source/styles'));

  gulp.src('./source/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    // .pipe(gulp.dest('./source'));
    .pipe(gulp.dest(templatesConfig.dest));
});

gulp.task('libs', ['slick'], () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'node_modules/sweetalert/dist/sweetalert.min.js'
  ])
  .pipe($.plumber())
  .pipe(gulp.dest(`.tmp/${templatesConfig.dest}/libs`))
  // TODO remove this after finishing build integration
  .pipe(gulp.dest(`../server/source/wp-content/themes/AFF/assets/libs`))
  .pipe(gulp.dest(`dist/${templatesConfig.dest}/libs`));
});

gulp.task('slick', () => {
  return gulp.src([
    'node_modules/slick-carousel/slick/**/*',
    '!node_modules/slick-carousel/slick/*.less',
    '!node_modules/slick-carousel/slick/*.scss',
  ])
  .pipe($.plumber())
  .pipe(gulp.dest(`.tmp/${templatesConfig.dest}/libs/slick`))
  .pipe(gulp.dest(`dist/${templatesConfig.dest}/libs/slick`));
});

gulp.task('build', ['lint', 'html', 'images', 'videos', 'fonts', 'extras'], () => {

  return gulp.src(['.tmp/'+templatesConfig.dest+'**/*'])
    .pipe(gulp.dest('dist/' + templatesConfig.dest));
});

gulp.task('build:dist', ['lint', 'html:dist', 'images', 'videos', 'fonts', 'extras'], () => {
  return gulp.src(
      ['.tmp/' + templatesConfig.dest + '**/*'])
    .pipe($.size({title: 'build', gzip: true}))
    .pipe(gulp.dest(distDir + templatesConfig.dest));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
