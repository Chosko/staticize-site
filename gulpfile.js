'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var del = require('del');
var runSequence = require('run-sequence');

var options = {
  hosts: {
    localhost: 'http://localhost:3000',
    staging: 'http://staging.myprojectoverview.com',
    prod: 'http://myprojectoverview.com'
  },
  pageListSrc: 'pageList.json',
  dist: 'dist'
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', function (done) {
  runSequence('staticize', done);
});

gulp.task('clean', function (done) {
  del([options.dist], done);
});
