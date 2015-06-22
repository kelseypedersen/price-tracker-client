// ***********************************
// Required for OAuth popup
var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
// ***********************************

// ***********************************
// The following two lines are globally scoped. These are initialized as empty and populated once facebook OAuth succeeds.
var fbData;
var userData;
// ***********************************

// ***********************************
// Will be used for ajax call. When API is pushed up, comment line 14, uncomment and edit line 15.
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'https://[OUR APP HERE].herokuapp.com/'
// ***********************************

$(document).ready(function(){

  // ***********************************
  // Confirms document and JS loaded
  console.log("Document Ready.");
  // ***********************************

  // ***********************************
  // The following will be cleaned up
  $('.button').on('click', function(e){
    // OAuth does not work without preventDefault
    e.preventDefault();

    // Firebase OAuth. Do not mess with this without chatting with Jacob or Alex.
    fbAuth().then(function(authData){
      fbData = authData;
      ajaxLogin(authData);
      // setProfile(authData);
    });
  });
  // ***********************************

});

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++

// ***********************************
// Facebook OAuth. Uses promise due to JS being single thread.
var fbAuth = function(){
  var promise = new Promise(function(resolve, reject){
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        alert("login failed!");
        reject(error);
      } else {
        resolve(authData);
      };
    });
  })
  return promise;
};

var ajaxLogin = function(authData){
  userId = authData.facebook.id;
  var ajaxData = {user:{oauth_id:userId}};
  $.ajax({
    url: baseUrl + 'users/' + userId + '/identify',
    type: 'GET',
    data: ajaxData
  }).done(function(response) {
    userData = response;
    // window.location.href = '#page-map';
  }).fail(function() {
    alert("Login Failed");
  });
};
// ***********************************
