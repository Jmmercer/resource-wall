$(() => {


$('.new-resource').click(function (event){
  event.preventDefault()
  //const new_url = $(RESOURCE-URL-INPUT).value();
  const new_url = 'http://www.cbc.ca/'

  $.ajax({
    method: "POST"
    url: `/resources/new`,
    context: document.body,
    data: JSON.stringify({ url: new_url}),
    success: function(response){
      console.log(response);
      $(location).attr('href', '/resources/new');
    }
  });

})

});