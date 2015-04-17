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
    // var xhr = new XMLHttpRequest();
    // var url = 'http://localhost:9292/api.soundcloud.com/me/activities?oauth_token=' + token;
    // function callTracks(){
    //   if(xhr){
    //     xhr.open('GET', url, true);
    //     xhr.withCredentials = true;
    //     xhr.onreadystatechange = handler;
    //     invocation.send();
    //   }
    // }
    $.ajax({
      url: resourceHost + '/me',
      data: {
        client_id: setting.clientId,
      },
      // type: 'GET',
      // crossDomain: true,
      // dataType: 'jsonp',
      beforeSend: function (xhr) {
        // xhr.setRequestHeader('Access-Control-Allow-Origin: *');
        // xhr.setRequestHeader('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        // xhr.setRequestHeader('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
        // xhr.setRequestHeader('Access-Control-Allow-Credentials: true');
        xhr.setRequestHeader('Authorization', "OAuth " + token);
        xhr.setRequestHeader('Accept',        "application/json");
      },
      success: function (response) {
          var nothing;
          return response.username;
      }
    });
    SC.get('http://localhost:9292/api.soundcloud.com/me/activities?oauth_token=' + token, {limit: 1000}, function(tracks){
      var track = tracks;
      console.log(track);
      var examined = 0;
      var shown = 0;
      var number = document.getElementById('howMany');
      while (shown < number.value) {
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