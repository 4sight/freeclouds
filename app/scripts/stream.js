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
            container.text(response.username);
          } else {
            container.text("An error occurred.");
          }
        }
      })
    this.render();
    },

    render: function(){
      SC.initialize({ client_id: setting.clientId });
      SC.get("/tracks", {limit: 1}, function(tracks){
        var track = tracks[0];
      SC.oEmbed(track.uri, document.getElementById('tracks'));
    });
  }
});