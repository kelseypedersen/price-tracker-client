$(document).ready(function(){
  submitSearch();
}); 

var submitSearch = function(){
  $("#product-search").on('submit', function(event){
    event.preventDefault();
    console.log("clicking the form");
  });
};








  // <div class="search-product-form">
  //   <form id="product-search" action="/products/results" method= "GET">
  //     <input type="text" name="search"/>
  //     <input type="submit" value="Search" />
  //   </form>
  // </div>
