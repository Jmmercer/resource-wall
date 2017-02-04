$(document).ready(function() {

  window.validateForm =  function() {
    // Check if form values are empty
    const a=document.forms["resource_details"]["title"].value;
    const b=document.forms["resource_details"]["url"].value;
    const c=document.forms["resource_details"]["img_src"].value;
    const d=document.forms["resource_details"]["description"].value;
    if (a==null || a=="",b==null || b=="",c==null || c=="",d==null || d=="")
      //console.log('');
      {
      alert("Make sure all fields are filled in");
      return false;
      }
    }

  $(".possible_img").click(function() {
    // Change image url input to selected image
    const source = $(this).find('img').attr('src');
    $('.imgSourceInput').val(source);

  })
})