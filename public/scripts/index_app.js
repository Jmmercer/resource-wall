const createResource = function(resource) {

  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <img src="http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg">
      <figcaption>${resource.title}</figcaption>
      <p>${resource.description}</p>
      <a href="${resource.url}"><em>source</em></a>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>
      <span><em>comments: ${resource.comments_count}</em><span>
      <span>rating: <a class="r-action ratings" href='#0' >${resource.avg_rating}</a><span>
    </figure>`)
}

$(() => {

  // Handling Likes
  $("#maincontent").on("click", "a.r-action", function(event) {
    event.preventDefault();
    const $this = $(event.target);
    const action = ($this.attr('class')).includes('likes') ? 'likes' : 'ratings';
    const res_id = $this.closest('.h-resource').data('res_id');

    $.ajax({
      url: `/resources/${res_id}/${action}`,
    }).done(function(newValue) {
      $this.text(newValue);
    })
  });

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
  });


});
