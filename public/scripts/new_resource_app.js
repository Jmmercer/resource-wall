const request = require('request');

const url = 'http://www.google.ca';

request.get(url, function (err, res, body) {
  console.log(res.statusCode);
  console.log(body);
});