var Stream = Backbone.View.extend({
  el: 'authenticated',

  initialize: function (){
    console.log('This is the streaming view');
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
    }
});