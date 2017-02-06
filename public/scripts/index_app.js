const createResource = function(resource) {
  return $(`<figure class="h-resource" data-res_id=${resource.id}>
      <a class="close" href="/">x</a>
      <img src=${resource.media_src}>
      <figcaption>${resource.title}</figcaption>

      <p>${resource.description}</p>
      <figcaption>
      <a class="" href="#0"><span class="r-action likes glyphicon glyphicon-heart-empty">${resource.likes_count}</span></a>
      <span>comments: <em class="comment-count">${resource.comments_count}</em><span>
      <span>rating: <a class="" href='#0' >${resource.avg_rating}</a><span>
      <em><a class="res-url res-source" href="${resource.url}" target="_blank">source</a></em>
      </figcaption>
      <form method="POST" action="" class="new-comment" style="display: none;">
        <div class="form-group" style="width: 100%;">
          <label for="comment-text" style="display:none;">New comment</label>
          <textarea id="comment-text" name="text" placeholder="What do you think of this resource?"  class="form-control" rows="3" required></textarea>
          <button type="submit" class="btn btn-default">Send</button>
        </div>
      </form>
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
      <p class="attribution">by <a href="/users/${comment.commenter_id}?owner=${comment.commenter}">
          ${comment.commenter}</a> about ${formatTime(comment.created_at)}</p>
    </div>
  </article>`);
}

const newCommentForm = $(``);

const processResource = function($thisResource) {
  $thisResource.css({"display": "block", "margin": "0 auto", "max-width": "1000px", "min-width":"450px", "width": "80%" });

  if ($thisResource.find('#comments').length < 1) {
    console.log("i'm doing ajax")
    $.ajax({
      url: `/resources/${$thisResource.data('res_id')}/comments`,
    }).done(function(result) {
      if(result.isLoggedIn) {
        const inputId = `#st${result.ratedValue}`;
        $thisResource.find(inputId).prop('checked', true);
        $thisResource.find('.wrapper').show();
        $thisResource.find('.new-comment').show();
        $thisResource.append($('<section id="comments"></section>'));
      }
      result.comments.forEach(function(comment) {
        $thisResource.find('#comments').append(createComment(comment));
      });
    });
  }
}

const showResource = function(event) {
  const $target = $(event.target);
  const $this = $(this);

  $this.css('opacity', 1);
  let $close = $this.find('.close');
  $close.css('display', 'block');
  $close.css('opacity', 1);

  const $thisResource = $target.closest('.h-resource');
  if ($target.hasClass("res-url") || $target.is('input') || $target.is('label')) {
  } else {
    $("#maincontent .h-resource").hide();
    $("#next-prev").show();
    $("#maincontent").css({"opacity": "1", "column-width": "auto"})
    $("#punch").css({"visibility": "visible", "z-index": "1"});

    processResource($thisResource);
  }
  $("#maincontent").off("resource:show");
}

// const loggedInState = function(isLoggedIn) { return $(`<input type="checkbox" checked=${isLoggedIn}`) }

$(() => {


  // Next / Prev show
  $("#maincontent").on('click', '.next, .prev', function(event) {
    event.preventDefault();
    let $target = $(event.target).closest('li');
    const $old = $('#maincontent').find('.h-resource:visible');
    const isNext = $target.is('.next');
    let $new = isNext ? $old.next() : $old.prev();
    $old.hide();
    if (!$new.is('.h-resource')) {
      $new = isNext ? $('#maincontent .h-resource').first() : $('#maincontent .h-resource').last();
    }
    processResource($new);
  })

  $('.close').css('display', 'none');

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
        $wrapper.find(inputId).prop('checked', true);
      } else {
        if (Number(newValue)) $this.text(newValue);
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

    let categoryIDs = [Number($('.dropdown-toggle').data('thisid'))];
    if (categoryIDs[0] == 30) {
      categoryIDs = undefined;
    }
    let search = $('.form-control').val();
    let data = {search: search, categoryIDs: categoryIDs};
    console.log('data', data);

    $.ajax({
      url: "/resources/search",
      method: "GET",
      data: data
    }).done(function(response) {
      let $container = $('#maincontent');
      $container.empty();
      response.forEach(function(resrc) {
        $container.append(createResource(resrc));
      });
    })
  });

  //Select category value
  $('.category-selector').click(function (event){
    console.log('$(this).data(\'id\')', $(this).data('id'));
    event.preventDefault();
    $('.dropdown-toggle').data('thisid', $(this).data('id'));
  });

});
