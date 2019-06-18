// $(function(){
  var extractToken = function(hash) {
    var match = hash.match(/access_token=([^&]*)/);
    return !!match && match[1];
  };
 
  var setting =
    {
      'host':     'soundcloud.com',
      'clientId': 'a51ea45caadec1ecd0ff45309d4f6485'
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