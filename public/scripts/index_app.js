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
      let mybody = '<body ' + response.split('<body')[1].split('</body>')[0] + '</body>';

      console.log(mybody);

      // const html = $.parseHTML(response);
      // console.log('html', html);
      // console.log($(html).find('#mngb'));
      // console.log('response', response);
      // console.log('HTML ' + JSON.stringify(html));
      // $(location).attr('href', '/');
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