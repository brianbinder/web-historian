var archive = require('../helpers/archive-helpers');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

exports.htmlFetcher = function() {
  console.log('setInterval has invoked htmlFetcher');
  archive.readListOfUrls(archive.downloadUrls);
};


