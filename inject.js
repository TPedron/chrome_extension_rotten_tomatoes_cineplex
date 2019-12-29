
// INJECT.JS by TOM PEDRON
// 1. Installed on a Cineplex.com page by BACKGROUND.JS
// 2. Adds a message listener to add a movie score to the page which is
//    meant to run several times, once for each movie with an RT score.
// 3. Each time, it retrieves the list of movie name DOM elements, then we
//    lazily parse it to find the right one based on movie name.
// 4. If the movie element is found, we update the inner text to include
//    the score.
// 5. After adding the listener, we then return a string array of all movies
//    found on the page based on the 'movie-details-link-click' class.

(function() {
  chrome.runtime.onMessage.addListener(function(message) {
    var info = message.parameter;
    score = info.score
    index = info.index
    name = info.name
    console.log("Adding score to page for " + name)

    // Update any movie-details-link-click elements
    movieElements = document.getElementsByClassName("movie-details-link-click");
    movie = movieElements[index];

    if(movie == null){
      console.log("Movie " + name + " not found on page.")
    }else if(movie.innerText == name && !movie.innerText.includes('% on RT') ){
      newText = movie.innerText + '('+ score+ '% on Rotten Tomatoes)'; 
      console.log("Adding " + newText)
      movie.innerText = newText;
    }
  });
})();

// Return list of movie names to BACKGROUND.JS
Array.from(document.getElementsByClassName("movie-details-link-click")).map(h => h.innerText);