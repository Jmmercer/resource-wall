const request = require('request');


const scraper_request = function (url, cb) {
//var url = 'http://www.cbc.ca/'

request.get(url, function (err, res, body) {
  console.log('inside scraper function');
  cb(body);
});
}

module.exports = scraper_request;