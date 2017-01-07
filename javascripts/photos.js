function fetchPhotos() {
  var flickerAPI = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=30c4f326d01f4cb98266aef9d5dd3fe7&format=json&jsoncallback=?&user_id=26430465@N02";

  $.getJSON(flickerAPI)
      .done(function(data) {
        $.each( data.photos.photo, function(i, item) {
          var imageUrl = "https://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg"
          $("<img>").attr("src", imageUrl).appendTo("#gallery");
        });
      });
}

fetchPhotos();
