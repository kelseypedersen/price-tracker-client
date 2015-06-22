var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'https://[OUR APP HERE].herokuapp.com/'

var fbData;
var userData;

$(document).ready(function(){
  begin();
  // add Mary's js code
  hardLanding();
  submitSearch();
});

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++

// ============== Ajax-Begin ==============
var begin = function(){
  $('.button').on('click', function(e){
    e.preventDefault();
    fbAuth().then(function(authData){
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
  userName = authData.facebook.displayName;
  var ajaxData = {
    user: {
      oauth_id:userId,
      oauth_name:userName
    }
  };

  $.ajax({
    url: baseUrl + "users",
    crossDomain: true,
    type:"post",
    data: ajaxData
  }).done(function(response) {
    userData = userId;
  }).fail(function() {
    alert("Login Failed");
  });
};
// ============== Ajax-End ==============

var hardLanding = function(){
  $('.button').on('click', function(event){
    event.preventDefault();

  $('form').remove();
  $(".search-product-form").css("display", "block");

  var request = $.ajax({
    url:"http://localhost:3000/products/newest_products",
    crossDomain: true,
    type:"GET"
   });

    request.done(function(data){
      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='product'><a href='" + products[i].clickUrl + "'>" + "<img src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
      };
    });
  });
};


var submitSearch = function(){
  $("#product-search").on('submit', function(event){
    event.preventDefault();

   var request = $.ajax({
    url:"http://localhost:3000/products/results",
    data: $(this).serialize(),
    crossDomain: true,
    type:"GET"
   });

   request.done(function(data){
    debugger
    console.log("successssssss");
    $(".softLanding").remove();
    var products = data["products"]


    for(i = 0; i < products.length; i++){
      $(".search-results").prepend("<div class='product'><a href='" + products[i].clickUrl + "'>" + "<img src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
    };

   });

   request.fail(function(data){
    console.log("fail");
   });
  });
};


