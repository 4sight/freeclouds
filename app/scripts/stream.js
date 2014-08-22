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
    $('input#box').keyup(function(){
      var number = $(this).val();
    });
    SC.get('/me/activities?oauth_token=' + token, {limit: 1000}, function(tracks){
      var track = tracks;
      console.log(track);
      var examined = 0;
      var shown = 0;
      while (shown < 20) {
        if (track.collection[examined].origin.downloadable == true) {
          SC.oEmbed(track.collection[examined].origin.uri, {}, function (oembed) {
            $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
          });
          shown++;
          } else {}
        examined++;
        }
        console.log(examined + ' tracks scanned');
      });
    }
  });