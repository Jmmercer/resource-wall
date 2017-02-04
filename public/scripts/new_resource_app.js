// const request = require('request');

// const url = 'http://www.google.ca';

// request.get(url, function (err, res, body) {
//   console.log(res.statusCode);
//   console.log(body);
// });

console.log('before new_resource_app.js')


$(() => {
  console.log('in new_resource_app.js')

  function validateForm() {
    console.log('in validateForm')
    const a=document.forms["resource_details"]["title"].value;
    const b=document.forms["resource_details"]["url"].value;
    const c=document.forms["resource_details"]["img_src"].value;
    const d=document.forms["resource_details"]["description"].value;
    if (a==null || a=="",b==null || b=="",c==null || c=="",d==null || d=="")
      {
      alert("Make sure all fields are filled in");
      return false;
      }
    }
}