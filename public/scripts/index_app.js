const createResource = function(resource) {

  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <img src="http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg">
      <figcaption>${resource.title}</figcaption>
      <p>${resource.description}</p>
      <em><a class="res-url" href="${resource.url}" target="_blank">source</a></em>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>
      <span><em>comments: ${resource.comments_count}</em><span>
      <span>rating: <a class="" href='#0' >${resource.avg_rating}</a><span>
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

// const loggedInState = function(isLoggedIn) { return $(`<input type="checkbox" checked=${isLoggedIn}`) }

$(() => {

  // Handling Likes TODO: handle rating
  $("#maincontent").on("click", ".r-action", function(event) {
    const $this = $(event.target);
    const action = $this.hasClass('likes') ? 'likes' : 'ratings';
    const res_id = $this.closest('.h-resource').data('res_id');
    const inputId = $this.attr('for');
    const data = (action === 'ratings') ? (6 - Number(inputId[2])) : undefined;

    $.ajax({
      url: `/resources/${res_id}/${action}`,
      data: {value: data}
    }).done(function(newValue) {
      if (data) {
        const $wrapper = $this.closest('.wrapper')
        $wrapper.next('.avg-rating').text(newValue);
        $wrapper.find('input').prop('checked', false);
        $(inputId).prop('checked', true);
      } else {
        $this.text(newValue);
      }
    });
    return false;
  });

  // Stop propagation 

  // Show a resource
  $("#maincontent").on("click", ".h-resource", function(event) {
    const $target = $(event.target);
    const $this = $(this);
    const $thisResource = $target.closest('.h-resource');
    if ($target.hasClass("res-url") || $target.is('input') || $target.is('label')) {
    } else {
      $("#maincontent").children().remove();
      $thisResource.css("min-width","650px");
      $("#maincontent").append($thisResource)

      $.ajax({
        url: `/resources/${$thisResource.data('res_id')}/comments`,
      }).done(function(result) {
        if(result.isLoggedIn) {
          $thisResource.find('.wrapper').show();
          $thisResource.append(newCommentForm);
        }
        result.comments.forEach(function(comment) {
          $thisResource.append(createComment(comment));
        });
      });
    }
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
