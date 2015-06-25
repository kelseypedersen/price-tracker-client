var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'http://young-ravine-5515.herokuapp.com/'

var fbData;
var userData;
var tempProdId;
var tempProdName;

$(document).ready(function(){
  begin();
  submitSearch();
  formHandler();
});

var wishlist = function(){
  showWishlist();
};

var populateWishList = function(){
  var request = $.ajax({
    url: baseUrl + "users/" + userData + "/wants",
    crossDomain: true,
    type:"get",
  });

  request.done(function(response){
    for(i = 0; i < response.length; i++){
      $('.wish-item-container').prepend("<div class='wish-item'><a class='remote-link' href='" + response[0].product_id + "'><img class='wish-item-image' src='temp' /></a><p class='item-name'>" + response[12].prod_name + "</p><a class='delete-link' href='" + response[0].product_id + "'>Delete</a><a class='update-link' href='" + response[0].product_id + "'>Edit</a></div>")
    };
  });

  request.fail(function(){
    console.log("populateWishList ajax call failed.");
  })
};

var showWishlist = function(){
  $(".nav-wishlist").on("click", function(event){
    event.preventDefault();

    populateWishList();

    $('.show-page').hide();
    $('.search-product-form').hide();

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++
    $('.softLanding').hide();
    $('.wish-page').show();
  });
};

// The following is terribly coded. Forgive me, for I have sinned. <3 Jacob.
// ============== OAuth-Begin ==============
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
      oauth_id: userId,
      oauth_name: userName
    }
  };
  $.ajax({
    url: baseUrl + "users",
    crossDomain: true,
    type:"post",
    data: ajaxData
  }).done(function(response) {
    userData = response.user.id;
    loadHome();
    wishlist();
  }).fail(function() {
    alert("Login Failed");
  });
};
// ============== OAuth-End ==============

var loadHome = function(){
  $(".hardLanding").remove();
  $(".search-product-form").css("display", "block");
  $(".nav-menu").css("display", "block");
  $(".container").css("display", "block");

  var request = $.ajax({
    url: baseUrl + "products/newest_products",
    crossDomain: true,
    type:"GET"
   });

  request.done(function(data){
    var products = data["products"]


      for(i = 0; i < products.length; i++){
        $(".softLanding").prepend("<div class='column-a'><a class='prod-link' href='" + baseUrl + "products/" + products[i].id + "'>" + "<img class='sa' src='" + products[i].image.sizes.Best.url + "' alt='product Image'>" + "</a></div>")
      };
    showListener();
  });
};

var submitSearch = function(){
  $("#product-search").on('submit', function(event){
    event.preventDefault();

    var request = $.ajax({
      url: baseUrl + "products/results",
      data: $(this).serialize(),
      crossDomain: true,
      type:"GET"
    });

    request.done(function(data){
      $(".softLanding").empty();

      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='product'><a class='prod-link' href='"+ baseUrl + "products/" + products[i].id + "'>" + "<img src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
      };
      showListener();
    });

    request.fail(function(data){
      console.log("fail");
    });
  });
};


var showListener = function(){
  $(".prod-link").on("click", function(){
    event.preventDefault();
    var request = $.ajax({
      url: $(this).attr('href'),
      crossDomain: true,
      type: "GET"
    });
    request.done(function(data){
      display(data);
      backButton();
      tempProdId = data.id;
      tempProdName = data.name;
    });
    request.fail(function(data){
      console.log("fail");
    });
  });
};

var backButton = function(){
  $('.back-button').on("click", function(event){
    event.preventDefault();
    $('.show-page').hide();
    $('.search-product-form').show();
    $('.softLanding').show();
  });
};

var display = function(shit){
  $('.prod-url').attr('href', shit.clickUrl);
  $('.prod-image').attr('src', shit.image.sizes.IPhone.url);
  $(".prod-name").html(shit.name);
  // $(".prod-brand").html(shit.brand.name);
  $(".prod-stock").html(shit.inStock);
  // $(".prod-desc").html(shit.description);
  $(".prod-cur").html(shit.salePrice);
  $(".prod-reg").html(shit.price);

  $('.search-product-form').hide();
  $('.softLanding').hide();
  $('.show-page').removeAttr("style");
};

var formHandler = function(){
  $('.wish-form').on("submit", function(event){
    event.preventDefault();
    var formData = $('.fuck-up').val();
    debugger
    var data = {
        wishPrice: formData,
        fbId: fbData,
        prodId: tempProdId,
        prodName: tempProdName,
    }
    var response = $.ajax({
      url: baseUrl + "users/" + userData + "/wants",
      crossDomain: true,
      type: 'post',
      data: data
    });
  });
};
