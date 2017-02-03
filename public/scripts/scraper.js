const scraper = function (url) {

  var http = require('https');

  function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
  }

  const url_breakdown = getLocation(url);

  var postData = JSON.stringify({
    'msg' : 'Hello World!'
  });

  var options = {
    hostname: url_breakdown.hostname,
    port: url_breakdown.port,
    path: url_breakdown.pathname,
    protocol: url_breakdown.protocol,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var doc_response = [];
  var req = http.request(options, (res) => {

    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`);
      doc_response.push(chunk);
    });
    res.on('end', () => {
      doc_response = doc_response.join('');
      console.log('No more data in response.');
      return doc_response;
    });


  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

// module.exports = scraper;

//console.log(scraper('https://www.yahoo.ca/'));

const request = require('request');


const scraper_request = function (url, cb) {
var url = 'http://www.ctv.ca';

request.get(url, function (err, res, body) {
  console.log(res.statusCode);
  cb(body);
});
}

module.exports = scraper_request;