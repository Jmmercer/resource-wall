const createResource = function(resource) {

  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <img src="http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg">
      <figcaption>${resource.title}</figcaption>
      <p>${resource.description}</p>
      <em><a class="res-url" href="${resource.url}" target="_blank">source</a></em>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>
      <span><em>comments: ${resource.comments_count}</em><span>
      <span>rating: <a class="r-action ratings" href='#0' >${resource.avg_rating}</a><span>
    </figure>`)
}

const createComment = function(comment) {

  return $(`<dl class="comment">
        <dt class="commenter" data-commenter_id=${comment.commenter_id}>
          ${comment.commenter}
        </dt>
        <dd class="comment-text">
          ${comment.text}
        </dd>
      </dl>`);
}

const newCommentForm = $(`<form method="POST" action="http://localhost:8080/tweets">
          <label for="tweet-text" style="display:none;">New comment</label>
          <textarea id="tweet-text" name="text" placeholder="What are you humming about?"  required></textarea>
          <button>Go</button>
        </form>`);

$(() => {

  // Handling Likes TODO: handle rating
  $("#maincontent").on("click", "a.r-action", function(event) {
    const $this = $(event.target);
    const action = ($this.attr('class')).includes('likes') ? 'likes' : 'ratings';
    const res_id = $this.closest('.h-resource').data('res_id');

    $.ajax({
      url: `/resources/${res_id}/${action}`,
    }).done(function(newValue) {
      $this.text(newValue);
    });
    return false;
  });

  // Show a resource
  $("#maincontent").on("click", function(event) {
    const $target = $(event.target);
    const targetClass = $target.attr("class");
    const $this = $(this);
    const $thisResource = $target.closest('.h-resource');
    if (targetClass && targetClass.includes("res-url")) {
    } else {
      $this.children().remove();
      $thisResource.css("min-width","650px");
      $this.append($thisResource);
      $this.append(newCommentForm);
    }
    $.ajax({
      url: `/resources/${$thisResource.data('res_id')}/comments`,
    }).done(function(comments) {
      comments.forEach(function(comment) {
        $this.append(createComment(comment));
      })
    })
  })

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
