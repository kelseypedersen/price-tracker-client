$(document).ready(function(){
  welcomeForm();
  submitSearch();
}); 

var welcomeForm = function(){

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
    $("#product-search").hide();

    var products = data["products"]


    for(i = 0; i < products.length; i++){
      $(".search-results").prepend("<div class='product'>" + products[i].clickUrl + "</div>")
    };

   });

   request.fail(function(data){
    console.log("fail");
   });
  });
};

