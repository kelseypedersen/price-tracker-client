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

  // fbAuth();
  // ajaxLogin();
  // submitSearch();
  // showListener();
  // backButton();
  // display();


  // bindEvents();
  // $('#facebooklogin').click(function(event){
  //   alert('fb button clicked!');
  // });


// var bindEvents = function(){

//   var formHandler = function(){
//     $('.wish-form').on("submit", function(event){
//       event.preventDefault();
//       var formData = $('.fuck-up').val();
//       var data = {
//           wishPrice: formData,
//           fbId: fbData,
//           prodId: tempProdId,
//           prodName: tempProdName,
//       }
//       var response = $.ajax({
//         url: baseUrl + "users/" + userData + "/wants",
//         crossDomain: true,
//         type: 'post',
//         data: data
//       });
//     });
//   };
// // };

// });


var formHandler = function(){
  $('.wish-form').on("submit", function(event){
    event.preventDefault();
    var formData = $('.fuck-up').val();
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

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++

// var showWishlist = function(){
//   $(".nav-wishlist").on("click", function(event){
//     event.preventDefault();
//   })
// }

// ============== Ajax-Begin ==============




var initialize = function(){
  var self = this;
  // this.store = new MemoryStore(function(){
    self.renderHomeView();
    self.begin();
    console.log('rendered homeview');
  // });
};

var renderHomeView = function(){
  var html =
    "<div class='hardLanding' id='facebooklogin'><form class='button' action='/users' method='post'></form></div>"
  $('body').html(html);
};


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
  }).fail(function() {
    alert("Login Failed");
  });
};
// ============== Ajax-End ==============

var loadHome = function(){
  $(".hardLanding").remove();
  $(".search-product-form").show();
  $(".nav-menu").css("display", "block");
  $(".container").css("display", "block");

  var request = $.ajax({
    url: baseUrl + "products/newest_products",
    crossDomain: true,
    type:"GET"
   });

  request.done(function(data){

    $("html").css('background-image', '');
    $("html").css('background-color', 'white');

    var products = data["products"]


      for(i = 0; i < products.length; i++){
        $(".softLanding").prepend("<div class='columns'><a class='prod-link' href='" + baseUrl + "products/" + products[i].id + "'>" + "<img class='sa' src='" + products[i].image.sizes.Best.url + "' alt='product Image'>" + "</a></div>")
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
      $(".container").css("display", "block");
      $(".softLanding").empty();
      $("html").css('background-image', '');
      $("html").css('background-color', 'white');

      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='columns'><a class='prod-link' href='"+ baseUrl + "products/" + products[i].id + "'>" + "<img class='sa' src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")

      };
      showListener();
    });

    request.fail(function(data){
      console.log("fail");
    });
  });
};

// The following is terribly coded. Forgive me, for I have sinned. <3 Jacob.

var showListener = function(){
  $(".prod-link").on("click", function(){
    event.preventDefault();
    var request = $.ajax({
      url: $(this).attr('href'),
      crossDomain: true,
      type: "GET"
    });

    request.done(function(data){
      $("html").css('background-image', '');
      $("html").css('background-color', 'white');
      $(".container").hide();
      display(data);
      backButton();
      // searchButton();
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
    $("html").css('background-image', '');
    $("html").css('background-color', 'white');
    $('.show-page').hide();
    $('.search-product-form').show();
    $('.softLanding').show();
    $(".container").css("display", "block");

  });
};

//++++++++++++ Nav Bar ++++++++++++++++++++++++//

// var searchButton = function(){
//   $('.search-button').on("click", function(event){
//     event.preventDefault();
//     $('.softLanding').hide();
//   });
// };

//++++++++++++ end ++++++++++++++++++++++++//

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