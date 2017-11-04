function fetchPhotos() {
  var flickerAPI = "https://elizabethengelman-photographs.herokuapp.com/flickr_photos"

  $.getJSON(flickerAPI)
    .done(function(data) {
      $.each( data, function(i, item) {
        var html = "<div class='box'>" +
                     "<div class='boxInner'>" +
                       "<img src='" + item + "'>" +
                       "</div></div>"
        $(html).appendTo("#gallery");
      });
    });
}

fetchPhotos();
