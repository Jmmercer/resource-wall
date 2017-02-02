$(() => {

  $.ajax({
    method: "GET",
    url: "/user"
  }).done((resources) => {
    for(resource of resources) {
      $("<div>").html(pin.title).appendTo($("body"));
    }
  })

});
