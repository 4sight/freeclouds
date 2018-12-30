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
      $('#wrapper').empty();
      var genre = document.getElementById('genreInput').value;
      var i;
      var regexArray = [];
      var regex = new RegExp(genre, 'ig');
      while (i < number.value){
        for (i = 0; i <= tracks.collection.length; i++){
          regexArray[i] = tracks.collection[i].origin.genre.search(regex)
          if (regexArray[i] != -1 || null || undefined){
            SC.oEmbed(tracks.collection[i].origin.uri, {}, function(oembed){
              $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
            });
          };
        };
      };
    };
    document.getElementById('searchButton').addEventListener('click', search);
  }
});