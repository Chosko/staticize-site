'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var del = require('del');
var runSequence = require('run-sequence');
var _ = require('lodash');

var options = {
  verbose: (_.indexOf(process.argv, '--verbose') >= 0),
  debug: (_.indexOf(process.argv, '--debug') >= 0),
  staging: (_.indexOf(process.argv, '--staging') >= 0),
  prod: (_.indexOf(process.argv, '--prod') >= 0),
  hosts: {
    dev: 'http://localhost:3000',
    staging: 'http://localhost:3000',
    prod: 'http://localhost:3000'
  },
  pageListSrc: 'pageList.json',
  dist: 'dist',
  concurrency: 12, // The maximum number of pages crawled at once (suggested is 4 per CPU)
  outputDirClean: false,
  timeout: 10000
};

if(options.staging){
  options.siteUrl = options.hosts.staging;
}
else if(options.prod){
  options.siteUrl = options.hosts.prod;
}
else{
  options.siteUrl = options.hosts.dev;
}

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', function (done) {
  return gupl.start('staticize', done);
});

gulp.task('clean', function () {
  return del([options.dist]);
});
