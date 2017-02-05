$(() => {

  $(".submitted-button").addClass("active");

  $(".liked-button").click(function () {
    // To show the clicked resource
    $("#maincontent").off("resource:show");
    $("#maincontent").on("resource:show", ".h-resource", showResource);
    $(".submitted-button").removeClass("active");

    $.ajax({
      method: "GET",
      url: "/users/liked"
      })
      .done(function(resources) {
        $('#maincontent').empty();

        resources.forEach(function (resource) {
          console.log('resource', resource);
          $('#maincontent').append(createResource(resource));
        });
      });
  })

  $(".submitted-button").click(function () {
    // To show the clicked resource
    $("#maincontent").off("resource:show");
    $("#maincontent").on("resource:show", ".h-resource", showResource);

    $.ajax({
      method: "GET",
      url: "/users/submitted"
      })
      .done(function(resources) {
        $('#maincontent').empty();

        resources.forEach(function (resource) {
          $('#maincontent').append(createResource(resource));
        });
      });
  })

});
