// BACKGROUND.JS by TOM PEDRON
// 1. Installs itself on the appropriate page
// 2. Adds a listener for when the page completes its updates on load
// 3. On completion of page load, runs inject.js which first adds a message 
//    listener on the page with logic to add the movie scores to the DOM, then
//    returns the list of movies based on the 'movie-details-link-click' class
//    used on Cineplex.com
// 4. For each movie returned, run an async query to the RottenTomatoes search 
//    API and save the score for the first returned movie (a lazy assumption).
// 5. As each RottenTomatoes API call is completed and parsed, send a message for
//    each movie the message listener installed via the inject.js in #3 which updates
//    the classes in the DOM with the score for the movie.

// INSTALL LISTENER
chrome.runtime.onInstalled.addListener(function() {
  console.log('Rotten Tomatoes on Cineplex Chrome Extension added.');
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlContains: "cineplex.com" }
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// PAGE LOAD COMPLETE LISTENER
chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    chrome.tabs.get(tabId, function(tab) {
      currUrl = tab.url
      if (currUrl != null && currUrl.includes("cineplex.com")){
        console.log("Running inject script")
        chrome.tabs.executeScript(
          info.tabId,
          { file: 'inject.js' },
          receiveMovieNames
        )
      }
    });
  }
});

// GET MOVIE NAMES LIST
async function receiveMovieNames(resultsArray){
  console.log("Getting scores for movies")
  if (typeof resultsArray !== 'undefined') {
    movieElements = resultsArray[0];
    if(movieElements != null && movieElements.length > 0){
      getScoresFromRT(movieElements)
    }
  }
}

// GET SCORES FOR MOVIE NAMES LIST
async function getScoresFromRT(movieElements){
  console.log(movieElements)
  scoresArray = []
  // Get scores for returned movie names
  Array.prototype.forEach.call(movieElements, function(movieName, index) {
    //Search Rotten Tomatoes for Movie
    pageSearchUrl = 'https://www.rottentomatoes.com/napi/search/?limit=2&query=' + encodeURI(cleanMovieName(movieName));

    sendApiCall(pageSearchUrl).then(result => {
      if(result != null && result.movies != null && result.movies[0] != null){
        movieScore = result.movies[0].meterScore
        external_link = 'https://www.rottentomatoes.com' + result.movies[0].url
        updateWebsiteWithScore(movieName, movieScore, external_link)
      }else{
        console.log('Score not found for ' + movieName );
      }
    });
  });
  return scoresArray
}

function cleanMovieName(movieName){
  // Remove Imax Suffix
  imaxSuffix = ': The IMAX Experience®'
  sanitizedMovieName = movieName.replace(imaxSuffix, '')
  // Remove sub titles info if in brackets (gets most cases)
  st_suffix = 's.t.)'
  if(sanitizedMovieName.endsWith(st_suffix)){
    sanitizedMovieName = sanitizedMovieName.substring(0, sanitizedMovieName.lastIndexOf('('));
  }

  return sanitizedMovieName
}

// UPDATE WEBSITE WITH SCORE FOR A SINGLE MOVIE (CALLED FOR EACH MOVIE)
function updateWebsiteWithScore(name, score, external_link){
  var obj = {
    "name": name,
    "score": score,
    "external_link": external_link
  }

  // Update Cineplex.com with rotten tomato scores
  chrome.tabs.query( {currentWindow: true, active: true},
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {parameter: obj});
      console.log('Completed updating Cineplex site with score for '+ name);
    }
  );
}

// SEND API CALL TO ROTTEN TOMATOES FOR THE MOVIE
async function sendApiCall(url){
  // make async api
  let response = await fetch(url);
  let json = await response.json();
  return json
}
