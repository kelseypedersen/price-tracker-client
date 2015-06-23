var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'https://[OUR APP HERE].herokuapp.com/'

var fbData;
var userData;

$(document).ready(function(){
  begin();
  // add Mary's js code
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
    loadHome();
  }).fail(function() {
    alert("Login Failed");
  });
};
// ============== Ajax-End ==============

var loadHome = function(){

  $('.hardLanding').remove();
  $(".search-product-form").css("display", "block");

  var request = $.ajax({
    url:"http://localhost:3000/products/newest_products",
    crossDomain: true,
    type:"GET"
   });

    request.done(function(data){
      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='product'><a href='" + baseUrl + "products/" + products[i].id + "'>" + "<img src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
      };
      showListener();
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
      $(".softLanding").empty();

      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='product'><a href='"+ baseUrl + "products/" + products[i].id + "'>" + "<img src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
      };
      showListener();
    });

    request.fail(function(data){
      console.log("fail");
    });
  });
};

// The following is terribly coded. I'm sorry. <3 Jacob.

var showListener = function(){
  $("a").on("click", function(){
    event.preventDefault();
    var request = $.ajax({
      url: $(this).attr('href'),
      crossDomain: true,
      type: "GET"
    });
    request.done(function(data){
      display(data);
    });
    request.fail(function(data){
      console.log("fail");
    });
  });
};

// var backButton = function(){

// };

var display = function(shit){
  $('.search-product-form').hide();
  $('.softLanding').hide();
  $('.show-page').removeAttr("style");

  $('.prod-image').attr('src', shit.image.sizes.IPhone.url);
  $(".prod-name").html(shit.name);
  $(".prod-brand").html(shit.brand.name);
  $(".prod-stock-status").html(shit.inStock);
  $(".prod-description").html(shit.description);
  $(".prod-current-price").html(shit.salePrice);
  $(".prod-orig-price").html(shit.price);
};
  // $('.back-button').on("click", function(event){
  //   event.preventDefault();
  //   $('.show-page').hide();
  //   $('.search-product-form').show();
  //   $('.softLanding').show();
  // });
