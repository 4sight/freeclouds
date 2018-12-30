var Stream = Backbone.View.extend({
  el: 'body',

  initialize: function (){
    $('div.authenticated').show();
    $('span.token').text(token);
    $.ajax({
        url: resourceHost + '/me',
        data: {
          client_id: setting.clientId
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', "OAuth " + token);
          xhr.setRequestHeader('Accept',        "application/json");
        },
        success: function (response) {
          var container = $('span.user');
          if (response) {
            var spacesRemoved = response.username.replace(/\s+/g, '-');
            container.append('<a href="https://soundcloud.com/">' + response.username + '</a>');
          } else {
            container.text('An error occurred.');
          }
        }
      })
    this.render();
    },

  render: function(){
    $('div#home').hide();
    $('div#homeHalo').hide();
    $('.home').removeClass();
    SC.initialize({ client_id: setting.clientId });
    console.log(setting.clientId);
    $.ajax({
      url: resourceHost + '/me',
      data: {
        client_id: setting.clientId,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', "OAuth " + token);
        xhr.setRequestHeader('Accept',        "application/json");
      },
      success: function (response) {
          var nothing;
          return response.username;
      }
    });
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks) {
      console.log(tracks);
      var examined = 0;
      var shown = 0;
      var number = document.getElementById('number');
      while (shown < number.value && examined < tracks.collection.length){
        if (tracks.collection[examined].origin){
          SC.oEmbed(tracks.collection[examined].origin.uri, {}, function(oembed){
            $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
          });
          shown++;
        }
        examined++;
      }
      console.log(examined + ' tracks scanned');
    });
    function search(){
      SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
        console.log(tracks);
        var examined = 0;
        var shown = 0;
        var number = document.getElementById('number');
        while (shown < number.value && examined < tracks.collection.length){            
          if (tracks.collection[examined].origin){
            var genres = [];
            genres[examined] = tracks.collection[examined].origin.genre;
            var genreArray = [];
            var genre = document.getElementById('genreInput').value;
            var regex = new RegExp(genre, 'ig');
            genreArray[examined] = genres[examined].search(regex);
            console.log(genreArray);
            genreArray.forEach(function(){
              if (tracks.collection[examined].origin && genreArray[examined] != -1){
                SC.oEmbed(tracks.collection[examined].origin.uri, {}, function(oembed){
                  $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
                });
              };
            });
          shown++;
        }
        examined++;
      }
      console.log(examined + ' tracks scanned');
    });
    $('#wrapper').empty();
    };
    document.getElementById('searchButton').addEventListener('click', search);
  }
});