var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var urlPath = url.parse(req.url).pathname;
  if (req.method === 'GET') {
    if (urlPath === '/') { urlPath = '/index.html'; }
    httpHelpers.serveAssets(res, urlPath);
  } else if (req.method === 'POST') {
    archive.collectUrl(req, function(url) {
      archive.isUrlInList(url, function(result) {
        if (result === false) {
          archive.addUrlToList(url, function() {
            httpHelpers.sendRedirect(res, '/loading.html');
          });
        } else {
          archive.isUrlArchived(url, function(result) {
            if (result) {
              httpHelpers.sendRedirect(res, '/' + url);
            } else {
              httpHelpers.sendRedirect(res, '/loading.html');
            }
          });
        }
      });
    });
  } else {
    httpHelpers.send404(res);
  }
};



//httpHelpers.serveAssets(res, 'web/public/loading.html');
