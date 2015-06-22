var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'https://[OUR APP HERE].herokuapp.com/'

var fbData;
var userData;

$(document).ready(function(){
  begin();
});

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++

var begin = function(){
  $('.button').on('click', function(e){
    e.preventDefault();
      debugger
    fbAuth().then(function(authData){
      fbData = authData;
      ajaxLogin(authData);
    });
  });
};

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
    url: baseUrl + "users/new",
    crossDomain: true,
    type:"GET",
    data: ajaxData
  }).done(function(response) {
    userData = response;
  }).fail(function() {
    alert("Login Failed");
  });
};
