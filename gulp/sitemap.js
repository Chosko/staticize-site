'use strict';

var gulp = require('gulp');
var sitemap = require('gulp-sitemap');
var packageConfig = require('../package.json');

module.exports = function(options) {

  gulp.task('sitemap', function () {
    gulp.src('dist/snapshots/**/*.html')
      .pipe(sitemap({
        siteUrl: 'http://onedollarcountry.com',
      }))
      .pipe(gulp.dest('dist'));
  });
};
