$(() => {


$('.new-resource').click(function (event){
  event.preventDefault()
  //const new_url = $(RESOURCE-URL-INPUT).value();
  const new_url = 'https://www.ctv.ca/'
  console.log('new_url', new_url);


  $.ajax({
    method: "GET",
    url: `/resources/new/`,
    context: document.body,
    data: {new_url: new_url},
    success: function(response){

      sources = [];
      const imgs = $($.parseHTML(response)).find('img');

      for (img in imgs) {
        sources.push($(imgs[img]).attr('src'));
      }

        $.ajax({
          method: "GET",
          url: "resources/new/choice",
          data: {sources: sources},
          success: function(){},
        });

      },

    error: function( request, status, error ) {
      console.log( "Request failed: " + request.responseText );
    },
    fail: function( sdkkjfb, request ) {
      console.log( "Request failed: " + request );
    }
  });

})

});
