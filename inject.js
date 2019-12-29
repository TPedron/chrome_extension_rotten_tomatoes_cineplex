
// INJECT.JS by TOM PEDRON
// 1. Installed on a Cineplex.com page by BACKGROUND.JS
// 2. Adds a message listener to add a movie score to the page which is
//    meant to run several times, once for each movie with an RT score.
// 3. Each time, it retrieves the list of movie name DOM elements via class,
//    then lazily parse it to find the right one based on movie name.
// 4. For all elements found for the current movie, we update the inner text to include
//    the score.
// 5. After adding the listener, we then return a string array of all movies
//    found on the page based on the supported classes.

(function() {
  chrome.runtime.onMessage.addListener(function(message) {
    info = message.parameter;
    score = info.score
    name = info.name

    movieElements1 = Array.from(document.getElementsByClassName("movie-details-link-click"));
    movieElements2 = Array.from(document.getElementsByClassName("movie-item-title ng-binding"));
    // add more movieElementsX lists here

    // Generate final list of all movie elements for supported classes to loop through and update the ones for the current movie
    allMovieElements = movieElements1.concat(movieElements2);

    for(var i = 0; i < allMovieElements.length; i++){
      addScoreToElement(allMovieElements[i], name, score)
    }
  });
})();

function addScoreToElement(movie, name, score){
  if(movie == null != null && movie.innerText == name && !movie.innerText.includes('% on RT') && score != null){
    newText = movie.innerText + ' ('+ score+ '% on Rotten Tomatoes)'; 
    console.log("Adding " + newText)
    movie.innerText = newText;
  }
}


// Return list of movie names to BACKGROUND.JS

// simple method to dedupe a string array taken from: https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

// found on urls like: https://www.cineplex.com/Showtimes/any-movie/nearby-theatres?Date=12/29/2019
movie_details_link_click_list = Array.from(document.getElementsByClassName("movie-details-link-click")).map(h => h.innerText);
console.log(movie_details_link_click_list)
// found on urls like https://www.cineplex.com/
movie_item_title_ng_binding_list = Array.from(document.getElementsByClassName("movie-item-title ng-binding")).map(h => h.innerText);
console.log(movie_item_title_ng_binding_list)
mergeArray = movie_details_link_click_list.concat(movie_item_title_ng_binding_list)

// dedupe in case we have any duplicate movies presented to minimize Rotten Tomatoes API calls
arrayUnique(mergeArray);