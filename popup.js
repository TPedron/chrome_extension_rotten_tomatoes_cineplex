function receiveMovieNames(resultsArray){
  chrome.extension.getBackgroundPage().console.log('Receiving movie names')
  movieElements = resultsArray[0]
  chrome.extension.getBackgroundPage().console.log(movieElements)

  scoresArray = []

  // Get scores for returned movie names
  Array.prototype.forEach.call(movieElements, function(movieName, index) {
    chrome.extension.getBackgroundPage().console.log('Movie ' + index + ' = ' + movieName);
    //scoresArray.push(80);
    scoresArray.push(getMovieScore(movieName));
  });
  chrome.extension.getBackgroundPage().console.log(scoresArray)

  // Update Cineplex.com with rotten tomato scores
  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id, 
      { code: 'var scoresArray = ' + JSON.stringify(scoresArray) },
      function() {
        chrome.tabs.executeScript(tabs[0].id, {file: 'inject.js'});
      }
    );
  });
}


function getMovieScore(movieName) {
  // Search Rotten Tomatoes for Movie
  chrome.extension.getBackgroundPage().console.log('Searcing for movie ' + movieName + ' on RT')
  pageSearchUrl = 'https://www.rottentomatoes.com/napi/search/?limit=1&query=' + encodeURI(movieName)
  chrome.extension.getBackgroundPage().console.log('URL = ' + pageSearchUrl)

  result = fetch(pageSearchUrl).then(r => r.text()).then(result => {

  })
  chrome.extension.getBackgroundPage().console.log('result')
  chrome.extension.getBackgroundPage().console.log(result)
  result['movies'][0]['meterScore'] // Take first result in search
  chrome.extension.getBackgroundPage().console.log('movieScore = ' + movieScore)

  // movieScore = 80
  return movieName + ' ('+movieScore+'% on RT)'
}


let runLogicButton = document.getElementById('runLogicButton');

runLogicButton.onclick = function(element) {
  chrome.extension.getBackgroundPage().console.log('BUTTON CLICK')

  chrome.extension.getBackgroundPage().console.log("Get Movie Names")
  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'Array.from(document.getElementsByClassName("movie-details-link-click")).map(h => h.innerText);' },
      receiveMovieNames
    )
  });
}
