var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(response, asset, callback) {
  fs.readFile(archive.paths.siteAssets + asset, {encoding: 'utf8'}, function(err, data) {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, 'utf8', function(err, data) {
        if (err) {
          if (callback) {
            callback();
          } else {
            exports.send404(response);
          }
        } else {
          exports.sendResponse(response, data);
        }
      });
    } else {
      exports.sendResponse(response, data);
    }
  });
};

exports.sendResponse = function(response, data, status) {
  if (!status) {
    status = 200;
  }
  response.writeHead(status, exports.headers);
  response.end(data);
};

exports.sendRedirect = function(response, location, status) {
  if (!status) {
    status = 302;
  }
  response.writeHead(status, {Location: location});
  response.end();
};

exports.send404 = function(response) {
  response.writeHead(404, exports.headers);
  response.end('404: Page not found');
};

// As you progress, keep thinking about what helper functions you can put here!
