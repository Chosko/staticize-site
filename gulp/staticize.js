'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');
var phantom = require('gulp-phantom');
var htmlSnapshots = require('html-snapshots');
var sitemap = require('gulp-sitemap');
var runSequence = require('run-sequence');
var PluginError = gutil.PluginError;

// Settings
var settings = {
  verbose: (_.indexOf(process.argv, '--verbose') >= 0),
  debug: (_.indexOf(process.argv, '--debug') >= 0),
  staging: (_.indexOf(process.argv, '--staging') >= 0),
  prod: (_.indexOf(process.argv, '--prod') >= 0),

  // The maximum number of pages crawled at once (suggested is 4 per CPU)
  concurrency: 12,
  outputDirClean: false,
  timeout: 10000
};


function gulpSnapshot(hosts) {
  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    var self = this;

    // If file is null, go ahead with it
    if (file.isNull()) {
      self.push(file);
      cb(); // Done.
    }

    // If file is buffer, process!
    if (file.isBuffer()) {

      // Get the array of pages
      var pageList = JSON.parse(file.contents.toString());

      // Get the host URL
      var host = hosts.localhost;
      if(settings.staging){
        host = hosts.staging;
      }else if(settings.prod){
        host = hosts.prod;
      }

      // Prepend the host URL to each page
      for (var i = 0; i < pageList.length; i++) {
        pageList[i] = host + pageList[i];
      }

      gutil.log(gutil.colors.blue('Creating ' + gutil.colors.bold(pageList.length) + ' snapshots.'));

      // Take the html snapshots of the pages
      var result = htmlSnapshots.run({
          input: 'array',
          source: pageList,
          processLimit: settings.concurrency,
          outputDir: path.join(__dirname, '../dist/snapshots'),
          outputDirClean: settings.outputDirClean,
          selector: {
            '__default': 'div[id=finished]'
          },
          useJQuery: {
            '__default': false
          },
          checkInterval: 250,
          pollInterval: 500,
          timeout: settings.timeout,
          snapshotScript: {
            script: 'removeScripts'
          }
        },
        // Callback. Called when everything is done
        function(err, snapshotsCompleted) {
          gutil.log(gutil.colors.blue(gutil.colors.bold(snapshotsCompleted.length) + ' snapshots completed.'));
          gutil.log(snapshotsCompleted[0]);
          gutil.log(pageList[0]);
          if (err) {
            gutil.log(gutil.colors.red('Failed to shapshot ' + gutil.colors.bold(pageList.length - snapshotsCompleted.length) + ' pages'));
          }

          // Return the same input file for further process
          self.push(file);

          cb(); // Done.
        }
      );

    }

    // If file is stream, emit an error (we don't support streams for this plugin)
    if (file.isStream()) {
      self.emit('error', new PluginError('gulp-list-pages', 'Streams are not supported!'));
      cb(); // Done.
    }

  });

  return stream;
}

// Define a 'staticize' task which makes use of the plugin
module.exports = function(options) {
  gulp.task('snapshots', function() {
    return gulp.src(options.pageListSrc)
      .pipe(gulpSnapshot(options.hosts));
  });

  gulp.task('staticize', function(callback) {
    runSequence('snapshots','sitemap', callback);
  });
};
