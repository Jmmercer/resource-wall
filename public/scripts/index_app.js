const createResource = function(resource) {

  return $(`<figure class="h-resource">
      <img src="http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg">
      <figcaption>${resource.title}</figcaption>
      <p>${resource.description}</p>
      <a href="${resource.url}"><em>source</em></a>
      <span>likes: ${resource.likes_count}<span>
      <span>rating: ${resource.avg_rating}<span>
      <span>comments: ${resource.comments_count}<span>
    </figure>`)
}

$(() => {


//Handling Search
$("#search-form").on("submit", function(event) {
  event.preventDefault();
  let $this = $(this);
  $.ajax({
    url: "/resources/search",
    method: "GET",
    data: $this.serialize()
  }).done(function(response) {
    let $container = $('#maincontent');
    $container.children().remove();
    response.forEach(function(resrc) {
      $container.append(createResource(resrc));
    });
  })
})


});
