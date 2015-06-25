var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
// var baseUrl = 'http://localhost:3000/'
var baseUrl = 'http://young-ravine-5515.herokuapp.com/'

var fbData;
var userData;
var tempProdId;
var tempProdName;
var tempProdUrl;


$(function(){
  // ******* Kelsey's Playground *******
  // builds the DOM
  // initialize();
  // ******* End of Kelsey's Playground *******
  begin();
  submitSearch();
  formHandler();
});

// ******* Kelsey's Sandbox *******

// var renderHomeView = function(){
//   var html =
//     "<div class='hardLanding' id='facebooklogin'><form class='button' action='/users' method='post'></form></div>"

//   $('body').html(html);
// };

// var initialize = function(){
//   var self = this;
//   // this.store = new MemoryStore(function(){
//     self.renderHomeView();
//     console.log('rendered homeview');
//   // });
// };

  //bindEvents();
  // $('#facebooklogin').click(function(event){
  //   alert('fb button clicked!');
  // });


// var showWishlist = function(){
//   $(".nav-wishlist").on("click", function(event){
//     event.preventDefault();
//   })
// }

// ******* End of Kelsey's Sandbox *******

// ============== OAuth-Begin ==============

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
      $('.wish-item-container').prepend("<div class='wish-item'><a class='remote-link' href='" + response[i].product_id + "'><img class='wish-item-image' src='" + response[i].url + "' /></a><p class='item-name'>" + response[i].prod_name + "</p><a class='delete-link' href='" + response[i].product_id + "'>Delete</a><a class='update-link' href='" + response[i].product_id + "'>Edit</a></div>")
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

    $('.softLanding').hide();
    $('.wish-page').show();
  });
};

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
  $(".search-product-form").show();
  $(".nav-menu").css("display", "block");
  $(".container").css("display", "block");
  homeButton();
  profileButton();

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


var showListener = function(){
  $(".prod-link").on("click", function(){
    event.preventDefault();
    var request = $.ajax({
      url: $(this).attr('href'),
      crossDomain: true,
      type: "GET"
    });

    request.done(function(data){
      $(".container").css("display", "block");
      $("html").css('background-image', '');
      $("html").css('background-color', 'white');
      $(".container").hide();
      display(data);
      backButton();

      // searchButton();

      tempProdId = data.id;
      tempProdName = data.name;
      tempProdUrl = data.image.sizes.IPhone.url;
    });
    request.fail(function(data){
      console.log("fail");
    });
  });
};

var backButton = function(){
  $('.back-button').on("click", function(event){
    event.preventDefault();
    $(".container").css("display", "block");
    $("html").css('background-image', '');
    $("html").css('background-color', 'white');

    $('.show-page').hide();
    $(".prod-cur").hide();
    $(".text-cur").hide();
    $('.prod-reg').html("");

    $('.search-product-form').show();
    $('.softLanding').show();
    $(".container").css("display", "block");
  });
};

//++++++++++++ Nav Bar ++++++++++++++++++++++++//

var homeButton = function(){
  $('.home-button').on("click", function(event){
    event.preventDefault();
    $(".container").css("display", "block");
    $('.softLanding').show();
    $('.show-page').hide();
  });
};

var profileButton = function(){
  $('.profile-button').on("click", function(event){
    event.preventDefault();
    $(".container").hide();
    $('.softLanding').hide();
    $('.show-page').hide();
  });
};

//++++++++++++ end ++++++++++++++++++++++++//

var display = function(shit){
  $('.prod-url').attr('href', shit.clickUrl);
  $('.prod-image').attr('src', shit.image.sizes.IPhone.url);
  $(".prod-name").html(shit.name);
  // $(".prod-brand").html(shit.brand.name);
  $(".prod-stock").html(shit.inStock);
  // $(".prod-desc").html(shit.description);

  $(".prod-reg").html("$" + shit.price);

  if(shit.salePrice !== undefined){
    tempRegPrice = $('.prod-reg').html();
    $('.prod-reg').html("<strike>" + tempRegPrice + "</strike>");
    $(".prod-cur").show();
    $(".text-cur").show();
    $(".prod-cur").html("$" + shit.salePrice);
  }

  $('.search-product-form').hide();
  $('.softLanding').hide();
  $('#add-confirm').hide();
  $('.wish-form').show();
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
        prodUrl: tempProdUrl,
    }
    var request = $.ajax({
      url: baseUrl + "users/" + userData + "/wants",
      crossDomain: true,
      type: 'post',
      data: data,
    });
    request.done(function(response){
      $('.wish-form').hide();
      $('#add-confirm').show();
      $('.fuck-up').val('');
    });
    request.fail(function(response){
      console.log("Ajax call failed:");
      console.log(response);
    });
  });
};
