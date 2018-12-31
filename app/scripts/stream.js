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
    var genres = [];
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
      console.log(tracks);
      var number = document.getElementById('number');
      var i;
      for (i = 0; i <= tracks.collection.length; i++){
        if (tracks.collection[i] == null){
          genres[i] = -1;
        } else {
          genres[i] = tracks.collection[i].origin.genre;
          // console.log(genres);
        };
      };
      var examined = 0;
      var shown = 0;
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
    console.log(genres);
    function search(){
      var searchArray = [];
      var regex = new RegExp(genre, 'ig');
      var genre = document.getElementById('genreInput').value;
      SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
        var number = document.getElementById('number');
        var examined = 0;
        var shown = 0;
        while (shown < number.value){
          if (searchArray[i] != -1 || null || undefined){
            var i;
            for (i = 0; i <= tracks.collection.length; i++){
              if (tracks.collection[i] != null || undefined){
              searchArray[i] = tracks.collection[i].origin.genre.search(regex)};
              // tracks.collection[i].origin.genre.search(regex);
              // var nullSearch;
              // var nullregex = new RegExp('\x00');
              // if (tracks.collection[i].origin.genre == null){
              //   console.log('nlllllll');
                // };
              // if (nullSearch != -1){
              // }
              SC.oEmbed(tracks.collection[i].origin.uri, {}, function(oembed){
                $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
              });
              shown++;
            };
            examined++;
          } else {
            searchArray[i] = -1;
          };
        };
      });
      $('#wrapper').empty();
    };
    document.getElementById('searchButton').addEventListener('click', search);
  }
});