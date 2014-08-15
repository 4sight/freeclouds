var Stream = Backbone.View.extend({
  el: 'authenticated',

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
    SC.get('/me/activities?oauth_token=' + token, {limit: 30}, function(tracks){
      console.log(token);
      var track = tracks;
      _.each(_.range(0,30), function(num){
        SC.oEmbed(track.collection[num].origin.uri, {}, function (oembed) {
          $('#wrapper').append('<div class="sound">' + oembed.html + '</div>');
          $('iframe').append(' iframe="false"');
          // var str0 = $('#sound' + num).html();
          // var str1 = $(str0).contents();
          // var str2 = str1.prevObject[0].outerHTML;
          // console.log(str2);
          // var iframe = document.getElementsByTagName('iframe');
          // console.log(iframe.contentDocument);
          // var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
          // .find(".sc-button-group");
        });
        // var str = $('#sound' + num).html();
        // console.log(str);
        // var match = text.search('sc-button-download');
        // console.log(match);
        // if (match = -1){
        //   console.log(num);
        // } else {
        //   $('#sound' + num).removeClass('hidden');
        // }
        }
      );
    })
  }
});