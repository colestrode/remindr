var gulp = require('gulp')
  , gutil = require('gulp-util')
  , concat = require('gulp-concat')
  , sass = require('gulp-sass')
  , minifyCss = require('gulp-minify-css')
  , rename = require('gulp-rename')
  , sh = require('shelljs')

  , wiredep = require('wiredep').stream
  , inject = require('gulp-inject')
  , angularFileSort = require('gulp-angular-filesort')
  , addSrc = require('gulp-add-src')

  , jshint = require('gulp-jshint')

  , connect = require('connect')
  , serveStatic = require('serve-static')
  , connectLiveReload = require('connect-livereload')
  ;


var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['www/app/**/*.js', '!www/app/**/*.spec.js']
};

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('angularInject', function() {
  var sortedSources = gulp
      .src([
        'www/+(app|common)/**/*.js',
        '!www/+(app|common)/**/*.spec.js'
      ], {read: true})
      .pipe(angularFileSort())
      .pipe(addSrc('www/+(assets|app|css|common)/**/*.css'))
    ;

  return gulp
    .src('www/index.html')
    .pipe(inject(sortedSources, {
      transform: function(filepath) {
        var fp = filepath.replace('/www/', '');
        return inject.transform.call(inject.transform, fp)
      }
    }))
    .pipe(gulp.dest('www'));
});

gulp.task('wiredep', function () {
  return gulp
    .src('./www/index.html')
    .pipe(wiredep({
      exclude: [
        'lib/bootstrap/dist/js/bootstrap.js', //just want the css, not js

        //the following are included in ionic.bundle.js
        'lib/angular/angular.js',
        'lib/angular-ui-router/release/angular-ui-router.js'
      ]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('jshint', function() {
  gulp.src(['www/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['jshint', 'angularInject']);
});


gulp.task('serve', ['wiredep', 'angularInject'], function(next) {
  var server = connect();
  server.use(connectLiveReload());
  server.use(serveStatic('www'));
  server.listen(9999, next);
});

gulp.task('default', ['serve']);

