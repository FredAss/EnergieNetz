/// <vs BeforeBuild='durandal' />
var gulp = require('gulp');
var durandal = require('gulp-durandal');
var del = require('del');
var bower = require('gulp-bower');

gulp.task('durandal', function() {

  del(['App/main-built.js'], function() {
    durandal({
        baseDir: 'app', //same as default, so not really required.
        main: 'main.js', //same as default, so not really required.
        output: 'main-built.js', //same as default, so not really required.
        almond: true,
        minify: false,
        extraModules: ['../bower_components/text/text'],
        //generateSourceMaps: true,
        //optimize: "uglify2",
        //preserveLicenseComments: false
      })
      .pipe(gulp.dest('dist'));
  });
});

gulp.task('build', function () {

  del(['dist/App'], function () {
    durandal({
      baseDir: 'app', //same as default, so not really required.
      main: 'main.js', //same as default, so not really required.
      output: 'main-built.js', //same as default, so not really required.
      almond: true,
      minify: false,
      extraModules: ['../bower_components/text/text'],
      //generateSourceMaps: true,
      //optimize: "uglify2",
      //preserveLicenseComments: false
    })
      .pipe(gulp.dest('dist/App'));
  });
  
  gulp.src(['bower_components/**/*']).pipe(gulp.dest('dist/bower_components'));
});
