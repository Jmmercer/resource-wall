const createResource = function(resource) {

  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <img src="http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/Q-Z/sun-bear-tongue.jpg">
      <figcaption>${resource.title}</figcaption>
                <a class="close" href="/">x</a>
      <p>${resource.description}</p>
      <em><a class="res-url" href="${resource.url}" target="_blank">source</a></em>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>          <a class="close" href="/">x</a>
      <span>comments: <em class="comment-count">${resource.comments_count}</em><span>          <a class="close" href="/">x</a>
      <span>rating: <a class="" href='#0' >${resource.avg_rating}</a><span>          <a class="close" href="/">x</a>
    </figure>`)
}

const createComment = function(comment) {

  return $(`<article class="comment">
    <a class="comment-img" href="#0">
      <img src="" alt="${comment.commenter}" width="50" height="50">
    </a>
    <div class="comment-body">
      <div class="text">
        <p>${comment.text}</p>
      </div>
      <p class="attribution">by <a href="#0" data-commenter_id=${comment.commenter_id}>
          ${comment.commenter}</a> at ${formatTime(comment.created_at)}</p>
    </div>
  </article>`);
}

const newCommentForm = $(`<form method="POST" action="" class="new-comment">
    <div class="form-group" style="width: 100%;">
      <label for="comment-text" style="display:none;">New comment</label>
      <textarea id="comment-text" name="text" placeholder="What do you think of this resource?"  class="form-control" rows="3" required></textarea>
      <button type="submit" class="btn btn-default">Send</button>
    </div>
  </form>`);

const showResource = function(event) {
  const $target = $(event.target);
  const $this = $(this);
  const $thisResource = $target.closest('.h-resource');
  if ($target.hasClass("res-url") || $target.is('input') || $target.is('label')) {
  } else {
    $("#maincontent").empty();
    $thisResource.css({"display": "block", "margin": "0 auto", "max-width": "1000px", "min-width":"450px", "width": "80%" });
    $("#maincontent").append($thisResource);
    $("#maincontent").css({"opacity": "1", "column-width": "auto"});

    $.ajax({
      url: `/resources/${$thisResource.data('res_id')}/comments`,
    }).done(function(result) {
      if(result.isLoggedIn) {
        const inputId = `#st${result.ratedValue}`;
        $(inputId).prop('checked', true);
        $thisResource.find('.wrapper').show();
        $thisResource.append(newCommentForm);
        $thisResource.append($('<section id="comments"></section>'));
      }
      result.comments.forEach(function(comment) {
        $('#comments').append(createComment(comment));
      });
    });
  }
  $("#maincontent").off("resource:show");
}

// const loggedInState = function(isLoggedIn) { return $(`<input type="checkbox" checked=${isLoggedIn}`) }

$(() => {

  // Handling new comment
  $('#maincontent').on('submit', '.new-comment', function(event) {
    event.preventDefault();
    const $this = $(event.target);
    const $thisResource = $this.closest('.h-resource');
    const resource_id = $thisResource.data('res_id');
    $.ajax({
      url: `/resources/${resource_id}/comments`,
      method: 'POST',
      data: $this.serialize()
    }).done(function(commentInfo) {
      console.log(commentInfo)
      $('#comments').prepend(createComment(commentInfo[0]));
      const $counter = $thisResource.find('.comment-count')
      $counter.text(`${commentInfo[1]}`);
      $this[0].reset();
    })
  })

  // Handling Likes & rating
  $("#maincontent").on("click", ".r-action", function(event) {
    const $this = $(event.target);
    const action = $this.hasClass('likes') ? 'likes' : 'ratings';
    const res_id = $this.closest('.h-resource').data('res_id');
    const inputId = '#' + $this.attr('for');
    const data = (action === 'ratings') ? (6 - Number(inputId[3])) : undefined;

    $.ajax({
      url: `/resources/${res_id}/${action}`,
      data: {value: data}
    }).done(function(newValue) {
      if (data) {
        const $wrapper = $this.closest('.h-resource')
        $wrapper.find('.avg-rating').text(newValue);
        $wrapper.find('input').prop('checked', false);
        $(inputId).prop('checked', true);
      } else {
        $this.text(newValue);
      }
    });
    return false;
  });

  // Show a resource
  $("#maincontent").on("resource:show", ".h-resource", showResource);

  $("#maincontent").on("click", ".h-resource", function(event) {
    $(event.target).closest('.h-resource').trigger("resource:show");
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
