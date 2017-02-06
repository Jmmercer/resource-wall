$(() => {

  $(".submitted-button").addClass("active");

  $(".liked-button").click(function () {
    // To show the clicked resource
    $("#maincontent").off("resource:show");
    $("#maincontent").on("resource:show", ".h-resource", showResource);
    $("#maincontent").css({"column-width": "320px"});
    $(".submitted-button").removeClass("active");
    const ownid = $("#own-id-info").data("ownerid");

    $.ajax({
      method: "GET",
      url: `/users/liked`,
      data: {ownid: ownid}
      })
      .done(function(resources) {
        $('#maincontent .h-resource').remove();
        $('#next-prev').hide();

        resources.forEach(function (resource) {
          $('#maincontent').append(createResource(resource));
        });
      });
  })

  $(".submitted-button").click(function () {
    // To show the clicked resource
    $("#maincontent").off("resource:show");
    $("#maincontent").on("resource:show", ".h-resource", showResource);
    $("#maincontent").css({"column-width": "320px"});
    const ownid = $("#own-id-info").data("ownerid");

    $.ajax({
      method: "GET",
      url: `/users/submitted`,
      data: {ownid: ownid}
      })
      .done(function(resources) {
        $('#maincontent .h-resource').remove();
        $('#next-prev').hide();

        resources.forEach(function (resource) {
          $('#maincontent').append(createResource(resource));
        });
      });
  })

});
