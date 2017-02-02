$(() => {

  $.ajax({
    method: "GET",
    url: "/"
  }).done((resources) => {
    for(resource of resources) {
      $("<div>").html(pin.title).appendTo($("body"));
    }
  })

});