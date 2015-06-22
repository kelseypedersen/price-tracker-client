$(document).ready(function(){
  submitSearch();
}); 

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
    var productResults = [];

    for(i = 0; i < products.length; i++){
      productResults.push(products[i].name) 
    }

    $(".search-results").html(productResults);
   });

   request.fail(function(data){
    console.log("fail");
   });
  });
};

