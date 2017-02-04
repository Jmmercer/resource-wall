const createResource = function(resource) {

  return $(`<figure>
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

      const parseHTML = function(str) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body.children;
      };

      const html = parseHTML(response);
      const imgs = $(html).find('img');

      let sources = [];
      for (let img in imgs) {
        if (imgs.hasOwnProperty(img) && !isNaN(Number(img))) {
        //console.log($(imgs[img]).attr('src'));
        sources.push($(imgs[img]).attr('src'));
        }
      }
      console.log('after for loop');

      $.ajax({
        method: "POST",
        url: "resources/new/choice",
        data: {sources: {butts: 544545, sttub: 653263}}
        //data: {sources: sources}
        // success: function(body){
        //   console.log('body', typeof body);
        //   $.load(body);
        //   // document.open();
        //   // document.write(XMLHttpRequest.body);
        //   // document.close();
        //   //console.log('body', body);
        //   console.log('second ajax');
        // },
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
