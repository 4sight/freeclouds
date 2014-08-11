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
            container.text('An error occurred.');
          }
        }
      })
    this.render();
    },

    render: function(){
      SC.initialize({ client_id: setting.clientId });
      SC.get("/tracks", {limit: 20}, function(tracks){
        var track = tracks;
        _.each(_.range(0,20), function(num){
          $('body').append('<div id="sound' + num + '" />');
          SC.oEmbed(track[num].uri, document.getElementById('sound' + num));
        //   if (){
        //     var text = $('div' + num).html();
        //     str.search(sc-button-download)
        // }
      );
    })
  }
});