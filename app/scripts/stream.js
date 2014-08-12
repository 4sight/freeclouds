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
          SC.oEmbed(track[num].uri, {}, function (oembed) {
            $('.hero-unit').append(oembed.html);
          });
          // var text = $('div#sound' + num).html();
          // var match = text.search('sc-button-download');
          // console.log(match);
          // if (match = -1){
          //   console.log(num);
          // } else {
          //   $('div#sound' + num).removeClass('hidden');
          // }
        }
      );
    })
  }
});