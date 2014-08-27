var Connect = Backbone.View.extend({
  el: 'body',

  initialize: function (){
    this.render();
    },

  render: function(){
    $('#wrapper').hide();
    $('span#welcome').hide();
    $('span#number').hide();
    $('div.authenticate').mouseenter(function(){
      $('div.authenticate').addClass('connectHover');
    });
    $('div.authenticate').mouseleave(function(){
      $('div.authenticate').removeClass('connectHover');
      }
    );
  }
});
var Router = Backbone.Router.extend({
	routes: {
		'' : 'connect',
		'stream' : 'stream'
	},

	connect: function(){
		new Connect();
	},

	stream: function(){
		new Stream();
	}
});

new Router();
Backbone.history.start();
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
    $('span#number').hide();
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
// $(function(){
  var extractToken = function(hash) {
    var match = hash.match(/access_token=([^&]*)/);
    return !!match && match[1];
  };
 
  var setting =
    {
      'host':     'soundcloud.com',
      'clientId': '3fec932af4887ac1efe6dfa7da818fd8'
    };
 
  var authHost     = "https://"     + setting.host;
  var resourceHost = "https://api." + setting.host;
 
  var endUserAuthorizationEndpoint = authHost + "/connect";
 
  var token = extractToken(document.location.hash);
  if (token) {
    new Stream();
  } else if (number > 200 || number < 1) {
    window.alert('Please enter a number between 1 and 200');
  } else {
    $('div.authenticate').show();
 
    var authUrl = endUserAuthorizationEndpoint +
      "?response_type=token" +
      "&client_id="    + setting.clientId +
      "&redirect_uri=" + window.location;
 
    $("a.connect").attr("href", authUrl);
  }
// });