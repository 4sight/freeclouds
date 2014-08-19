var Stream = Backbone.View.extend({
  className: 'authenticated',

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
            container.append('<a href="https://soundcloud.com/' + spacesRemoved + '">' + response.username + '</a>');
          } else {
            container.text('An error occurred.');
          }
        }
      })
    this.render();
    },

  render: function(){
    SC.initialize({ client_id: setting.clientId });
    console.log(setting.clientId);
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
          var nothing;
          return response.username;
      }
    });
SC.get('/me/activities?oauth_token=' + token, {limit: 400}, function(tracks){
      var track = tracks;
      console.log(track);
      var examined = 0;
      var shown = 0;
      while (shown < 40) {
        console.log(track.collection[examined].origin.downloadable);
        if (track.collection[examined].origin.downloadable == true) {
          console.log(examined + ' is downloadable');
          SC.oEmbed(track.collection[examined].origin.uri, {}, function (oembed) {
            $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
          });
          shown++;
        }
        // else if (track.collection[num].origin.downloadable = 'false') {
        //     console.log("I'm not downloadable");}
          else {console.log(examined + ' is not downloadable');}
          examined++;
        }
      });
    }
  });