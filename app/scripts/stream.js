var Stream = Backbone.View.extend({
  el: 'body',

  initialize: function (){
    $('img#cloudAnimation').hide();
    $('div.authenticated').show();
    $('span.token').text(token);
    $.getJSON({
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
    if($(window).width() > 950){
      $('#breakForSubmitButton').remove();
    };
    if($(window).width() > 950){
      $('breakForGenreSearchButton').remove();
    };
    SC.initialize({ client_id: setting.clientId });
    console.log(setting.clientId);
    $.getJSON({
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
    var genres = [];
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
      console.log(tracks);
      var number = document.getElementById('number');
      var i;
      for (i = 0; i <= tracks.collection.length; i++){
        if (tracks.collection[i] == null || tracks.collection[i].origin == null){
          genres[i] = -1;
        } else {
          // Put genres into array
          genres[i] = tracks.collection[i].origin.genre;
        };
      };
      var examined = 0;
      var shown = 0;
      while (shown < number.value && examined < tracks.collection.length){
        if (tracks.collection[examined].origin){
          $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
          shown++;
        }
        examined++;
      }
      console.log(examined + ' tracks scanned');
    });
    console.log(genres);
    function search(){
      $('#wrapper').empty();
      var genreArray = [];
      // If search field is not sumbitted blank...
      if (document.getElementById('genreInput').value != ''){
        // Get up to 200 tracks from the users' Soundcloud feed
        SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
          var examined = 0;
          var shown = 0;
          // This line specifies how many tracks to show:
          var number = document.getElementById('number');
          console.log(tracks);
          while (shown < number.value && examined < tracks.collection.length){        
            // If the examined track has some metadata (is not "null")...
            if (tracks.collection[examined].origin){
              var genre = document.getElementById('genreInput').value;
              var regex = new RegExp(genre, 'ig');
              // ...and if the track has a genre...
              if (genres[examined] != null){
                // ...put the regex search results into genreArray.
                genreArray[examined] = genres[examined].search(regex);
                if (genreArray[examined] != -1){
                  $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                  shown++;
                  console.log(genreArray);
                } else {
                  genres[examined] = -1;
                };
              }
              examined++;
              } else {
              genreArray[examined] = -1;
              }
            }
          console.log(examined + ' tracks scanned');
        });
            console.log(genreArray);
      } else {
        // If the default stream is displayed, a blank search does nothing.
        if (genreArray.length > 0){}
        // If search results are displayed, a blank search resets the window.
        else {
          $('#wrapper').empty();
          SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
            console.log(tracks);
            var number = document.getElementById('number');
            var i;
            for (i = 0; i <= tracks.collection.length; i++){
              if (tracks.collection[i] == null){
                genres[i] = -1;
              } else {
                genres[i] = tracks.collection[i].origin.genre;
              };
            };
            var examined = 0;
            var shown = 0;
            while (shown < number.value && examined < tracks.collection.length){
              if (tracks.collection[examined].origin){
                $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                shown++;
              }
              examined++;
            }
            console.log(examined + ' tracks scanned');
          });
        };
      };
    };
    document.getElementById('searchButton').addEventListener('click', search);
    // Reset button
    function reset(){
        $('#wrapper').empty();
        SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks){
          console.log(tracks);
          var number = document.getElementById('number');
          var i;
          for (i = 0; i <= tracks.collection.length; i++){
            if (tracks.collection[i] == null){
              genres[i] = -1;
            } else {
              genres[i] = tracks.collection[i].origin.genre;
            };
          };
          var examined = 0;
          var shown = 0;
          while (shown < number.value && examined < tracks.collection.length){
            if (tracks.collection[examined].origin){
              $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
              shown++;
            }
            examined++;
          }
          console.log(examined + ' tracks scanned');
      });
    };
    document.getElementById('resetButton').addEventListener('click', reset);
  }
});