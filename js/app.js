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
// Will be used for ajax call
// var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'https://calm-island-3256.herokuapp.com/'
// ***********************************

$(document).ready(function(){

  // ***********************************
  // Confirms document and JS loaded
  console.log("Document Ready.");
  // ***********************************

  // ***********************************
  // The following will be cleaned up
  $('.button').on('click', function(e){
    // Prevent default not really needed. YOLO
    e.preventDefault();

    // Firebase OAuth. Do not mess with this without chatting with Jacob or Alex.
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
    // Will use this for a refactored OAuth call
    // fbAuth().then(function(authData){
    //   fbData = authData;
    //   var fbString = JSON.stringify(authData);
    //   window.localStorage.setItem("fbData", fbString);
      // ajaxLogin(authData);
      // setProfile(authData);
    // });
  });
  // ***********************************

});

//function definitions only ++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ***********************************
// Please do not touch the following. Being used as referance for refactor and future OAuth


// var fbAuth = function(){
//   var promise = new Promise(function(resolve, reject){
//     ref.authWithOAuthPopup("facebook", function(error, authData) {
//       if (error) {
//         alert("login failed!");
//         reject(error);
//       } else {
//         resolve(authData);
//       };
//     });
//   })
//   return promise;
// };

// var ajaxLogin = function(authData){
//   userId = authData.facebook.id;
//   var ajaxData = {user:{oauth_id:userId}};
//   $.ajax({
//     url: baseUrl + 'users/'+userId+'/identify',
//     type: 'GET',
//     data: ajaxData
//   }).done(function(response) {
//     userData = response;
//     window.location.href = '#page-map';
//   }).fail(function() {
//     alert("Login Failed");
//   });
// };
// ***********************************
