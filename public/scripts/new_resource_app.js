$(document).ready(function() {

  window.validateForm =  function() {
    const a=document.forms["resource_details"]["title"].value;
    const b=document.forms["resource_details"]["url"].value;
    const c=document.forms["resource_details"]["img_src"].value;
    const d=document.forms["resource_details"]["description"].value;
    if (a==null || a=="",b==null || b=="",c==null || c=="",d==null || d=="")
      console.log('');
      {
      alert("Make sure all fields are filled in");
      return false;
      }
    }
})