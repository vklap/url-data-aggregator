/**
 * Created by victor on 07/06/15.
 */

var request = require('request');
var async = require('async');

module.exports = function(options) {
  var limit = options.limit || 5;

  return function(req, res, next) {
    var urls = req.query.urls;
    if (!urls) {
      return next();
    }
    else {
      var urlList = urls.split(',').map(function(encodedUrl) {
        return decodeURI(encodedUrl);
      });

      var headers = req.headers;

      function iterator(url, callback) {
        request(url, function(error, response, body){

        });
      }

      function result(err) {


      }

      async.eachLimit(urlList, limit, iterator, result);
    }
  };
};

