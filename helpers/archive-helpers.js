var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    if (!data.length) {
      var urls = [];
    } else {
      console.log('data: ', data);
      urls = data.split('\n');
    }
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {
  var urlIsPresent;
  exports.readListOfUrls(function(urls) {
    if (urls.indexOf(url) !== -1) {
      urlIsPresent = true;
    } else {
      urlIsPresent = false;
    }
    callback(urlIsPresent);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) {
      console.log('problem writing');
    }
    console.log('url: ', url);
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  //check
  var sitePath = path.join(exports.paths.archivedSites, url);
  fs.access(sitePath, function(err) {
    callback(!err);
  });

};

exports.downloadUrls = function(urls) {

  _.each(urls, function(url) {
    if (!url) {
      return;
    }
    request('http://' + url, function(err, res, body) {
      fs.writeFile(path.join(exports.paths.archivedSites, url), body);
    });
  });


};

exports.collectUrl = function(request, callback) {
  var data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    callback( data.slice(4) );
  });
};
