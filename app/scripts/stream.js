var Stream = Backbone.View.extend({
  el: 'body',

  initialize: function(){
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
    if ($(window).width() > 950){
      $('#breakForSubmitButton').remove();
    };
    if ($(window).width() > 950){
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
          xhr.setRequestHeader('Authorization', 'OAuth ' + token);
          xhr.setRequestHeader('Accept',        'application/json');
      },
      success: function (response) {
          var nothing;
          return response.username;
      }
    });
    var genres = [];
    var genreArray = [];
    var shown = 0;
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
      if (error) {
          window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
      } else {
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
      while (shown < number.value && examined < tracks.collection.length){
        if (tracks.collection[examined].origin){
          $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
          shown++;
        }
        examined++;
      }
      console.log(examined + ' tracks scanned');
    }});
    console.log(genres);
    function searchFunction(){
      // If search field is not sumbitted blank...
      if (document.getElementById('genreInput').value != '' && document.getElementById('checkbox').checked == false){
        // ...get up to 200 tracks from the users' Soundcloud feed
        console.log('search entered');
        SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
          if (error) {
            window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
        } else { 
          $('#wrapper').empty();
          var examined = 0;
          var shown = 0;
          var start = Date.now();
          // This line specifies how many tracks to show:
          var number = document.getElementById('number');
          while (shown < number.value && examined < tracks.collection.length && (Date.now() - start < 5000)){        
            // If the examined track has some metadata (is not null)...
            if (tracks.collection[examined].origin){
              var genre = document.getElementById('genreInput').value;
              var regex = new RegExp(genre, 'ig');
              // ...and if the track has a genre...
              if (genres[examined] != null){
                // ...put the regex search results into genreArray.
                genreArray[examined] = genres[examined].toString().search(regex);
                if (genreArray[examined] != -1){
                  $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                  shown++;
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
        }});
      } else if (document.getElementById('genreInput').value != '' && document.getElementById('checkbox').checked == true) {
        console.log('checkbox checked, no search entered');
        SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
          if (error) {
            window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
          } else {
            $('#wrapper').empty();
            var examined = 0;
            var shown = 0;
            var start = Date.now();
            // This line specifies how many tracks to show:
            var number = document.getElementById('number');
            while (shown < number.value && examined < tracks.collection.length && (Date.now() - start < 5000)){        
              // If the examined track has some metadata (is not null)...
              if (tracks.collection[examined].origin){
                var genre = document.getElementById('genreInput').value;
                var regex = new RegExp(genre, 'ig');
                // ...and if the track has a genre...
                if (genres[examined] != null){
                  // ...put the regex search results into genreArray.
                  genreArray[examined] = genres[examined].toString().search(regex);
                  if (genreArray[examined] != -1 && tracks.collection[examined].origin.downloadable == true){
                    $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                    shown++;
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
          }
        });
      } else {
        // If the default stream is displayed, a blank search does nothing.
        if (genreArray.length > 0){console.log('blank search, no action taken');}
        // If search results are displayed, a blank search refreshes the view.
        else {
          console.log('refreshing view')
          $('#wrapper').empty();
          SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
            console.log('getting tracks');
            if (error) {
              window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
            } else {
            console.log(tracks);
            var number = document.getElementById('number');
            var i;
            for (i = 0; i <= tracks.collection.length; i++){
            console.log(i);
              if (tracks.collection[i] == null || tracks.collection[i].origin == null){
                genres[i] = -1;
              } else {
                genres[i] = tracks.collection[i].origin.genre;
              };
            };
            var examined = 0;
            var shown = 0;
            var start = Date.now();
            while (shown < number.value && examined < tracks.collection.length && (Date.now() - start < 5000)){
              if (tracks.collection[examined].origin){
                $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                shown++;
              }
              examined++;
            }
            console.log(examined + ' tracks scanned');
          }});
        };
      };
    };
    document.getElementById('searchButton').addEventListener('click', searchFunction);
    // Reset button
    function reset(){
      // Set number of tracks displayed back to 20
      $('#number').val(20);
      // Clear genre search term
      document.getElementById('genre').reset();
      $('#wrapper').empty();
      SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
        if (error) {
          window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
        } else {
        console.log(tracks);
        var number = document.getElementById('number');
        var i;
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
      }});
    };
  document.getElementById('resetButton').addEventListener('click', reset);

  // If the checkbox is checked and there is something in the genre search field...
  $(document).on('change', 'input[type=checkbox]', function downloadable(){
    if (document.getElementById('checkbox').checked == true && document.getElementById('genreInput').value != ''){
    console.log('checkbox checked, no search entered');
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
      if (error) {
        window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
      } else {
        $('#wrapper').empty();
        var examined = 0;
        var shown = 0;
        var start = Date.now();
        // This line specifies how many tracks to show:
        var number = document.getElementById('number');
        while (shown < number.value && examined < tracks.collection.length && (Date.now() - start < 5000)){        
          // If the examined track has some metadata (is not null)...
          if (tracks.collection[examined].origin){
            var genre = document.getElementById('genreInput').value;
            var regex = new RegExp(genre, 'ig');
            // ...and if the track has a genre...
            if (genres[examined] != null){
              // ...put the regex search results into genreArray.
              genreArray[examined] = genres[examined].toString().search(regex);
              if (genreArray[examined] != -1 && tracks.collection[examined].origin.downloadable == true){
                $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                shown++;
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
      }
    });
  } else if (document.getElementById('checkbox').checked == false && document.getElementById('genreInput').value != ''){
    console.log('checkbox unchecked, genre search entered');
    window.location.reload();
    searchFunction();
  } else if (document.getElementById('checkbox').checked == false && document.getElementById('genreInput').value == '') {
    searchFunction();
  } else {
    SC.get('/me/activities?oauth_token=' + token, {limit: 200}, function(tracks, error){
      if (error) {
        window.alert("Soundcloud is temporarily denying freecloud's request for data. Please try again later.");
      } else {
        $('#wrapper').empty();
        var examined = 0;
        var shown = 0;
        var start = Date.now();
        // This line specifies how many tracks to show:
        var number = document.getElementById('number');
        while (shown < number.value && examined < tracks.collection.length && (Date.now() - start < 5000)){        
          // If the examined track has some metadata (is not null)...
          if (tracks.collection[examined].origin){
              if (tracks.collection[examined].origin.downloadable == true){
                $('#wrapper').append('<div class="sound"><iframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src="https://w.soundcloud.com/player/?visual=true&url=' + tracks.collection[examined].origin.uri + '"</div>');
                shown++;
              } else {};
            examined++;
            } else {}
          }
        console.log(examined + ' tracks scanned');
      }
    });
  }});
  $('#submitButton').click(function(){
    var newNumber = document.getElementById('number');
    if (newNumber === shown){console.log('no change')}
    else if (newNumber < shown){
      for (i = 0; i < (shown - newNumber.value); i++){
        $('#wrapper').children('div[class=sound]:last').remove();
        console.log('remove ' + i);
        console.log('decrease');
      }
    }
    else {
      console.log('increase');
      searchFunction();
      };
    });
  }
});