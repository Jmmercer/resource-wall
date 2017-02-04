const request = require('request');


const scraper_request = function (url, cb) {
var url = 'http://www.cbc.ca/'

request.get(url, function (err, res, body) {
  console.log(res.statusCode);
  cb(body);
});
}

module.exports = scraper_request;