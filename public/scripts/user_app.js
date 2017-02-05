$(() => {
  const createResource = function(resource) {

  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <img src="${resource.media_src}">
      <figcaption>${resource.title}</figcaption>
      <p>${resource.description}</p>
      <a href="${resource.url}"><em>source</em></a>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>
      <span><em>comments: ${resource.comments_count}</em><span>
      <span>rating: <a class="r-action ratings" href='#0' >${resource.avg_rating}</a><span>
    </figure>`)
  }

  $(".liked-button").click(function () {
    $.ajax({
      method: "GET",
      url: "/users/liked"
      })
      .done(function(resources) {
        $('#maincontent').empty();

        resources.forEach(function (resource) {
          $('#maincontent').append(createResource(resource));
        });

      });
  })

  $(".submitted-button").click(function () {
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
