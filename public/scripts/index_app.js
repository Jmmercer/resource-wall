$(() => {
  console.log('inside index_app.js')
  $.ajax({
    method: "GET",
    url: "/"
  }).done((resources) => {
    console.log('inside ajax in index_app.js')
    // for(resource of resources) {
    //   $("<div>").html(pin.title).appendTo($("body"));
    // }
  })

});