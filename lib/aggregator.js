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
      var resultsContainer = {
        data: []
      };

      function iterator(url, callback) {
        var requestOptions = {
          url: url,
          header: headers
        };

        request(requestOptions, function(error, response, body){
          var result = {};
          if (!error && response.statusCode == 200) {
            result.info = JSON.parse(body);
            result.hasError = false;
          }
          else {
            result.info = response.error;
            result.hasError = true;
          }
          result.url = url;
          result.statusCode = response.statusCode;
          resultsContainer.data.push(result);
        });
      }

      function resultCallback(err) {
        if (err) {
          resultsContainer.globalError = err;
          resultsContainer.statusCode = 400;
        }
        else {
          resultsContainer.globalError = null;
          resultsContainer.statusCode = 200;
        }
        res.status(resultsContainer.statusCode).json(resultsContainer);
      }

      async.eachLimit(urlList, limit, iterator, resultCallback);
    }
  };
};

