// const request = require('request');

// const url = 'http://www.google.ca';

// request.get(url, function (err, res, body) {
//   console.log(res.statusCode);
//   console.log(body);
// });

$(() => {
  function validateForm() {
    var a=document.forms["Form"]["answer_a"].value;
    var b=document.forms["Form"]["answer_b"].value;
    var c=document.forms["Form"]["answer_c"].value;
    var d=document.forms["Form"]["answer_d"].value;
    if (a==null || a=="",b==null || b=="",c==null || c=="",d==null || d=="")
      {
      alert("Please Fill All Required Field");
      return false;
      }
    }
}