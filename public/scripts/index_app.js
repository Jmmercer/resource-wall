$(() => {


$('.new-resource').click(function (event){
  event.preventDefault()
  const new_url = 'https://www.cbc.ca/'

  $.ajax({
    method: "GET",
    url: `/resources/new`,
    context: document.body,
    data: {new_url: new_url},
    success: function(response){

      console.log('response', typeof response);

      // console.log('response', response);
      console.log('index app first ajax')
      let sources = [];
      const imgs = $($.parseHTML(response)).find('img');

      for (let img in imgs) {
        if (imgs.hasOwnProperty(img) && !isNaN(Number(img))) {
        console.log($(imgs[img]).attr('src'));
        sources.push($(imgs[img]).attr('src'));
        }
      }
      console.log('after for loop');
      console.log('sources in first ajax', sources);

      $.ajax({
        method: "GET",
        url: "resources/new/choice",
        data: {sources: sources},
        success: function(body){
          console.log('body', body);
          console.log('second ajax');
        },
      });
    },

    error: function( request, status, error ) {
      console.log( "Request failed: " + request.responseText );
    },
    fail: function( jxXML, request ) {
      console.log( "Request failed: " + request );
    }
  });

})

});