
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Rotten Tomatoes on Cineplex added.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlContains: "cineplex.com/Showtimes" }
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status === 'complete') {
    chrome.tabs.executeScript(
      info.tabId,
      { code: 'Array.from(document.getElementsByClassName("movie-details-link-click")).map(h => h.innerText);' },
      receiveMovieNames
    )
  }
});

// GET MOVIE NAMES
async function receiveMovieNames(resultsArray){
  console.log("RECIEVE MOVIE NAMES")
  console.log(resultsArray)
  if (typeof resultsArray !== 'undefined') {
    movieElements = resultsArray[0];
    console.log(movieElements.length)
    console.log(movieElements)
  
    if(movieElements.length > 0 && !movieElements[0].includes('% on RT')){
      getScores(movieElements)
    }
  }

  //movieElements = resultsArray[0];



  // scoresArray = await getScores(movieElements)
  //   .then(data => {
  //     console.log("Waiting on api request completion");
  //   })
  //   .catch(err => {
  //     console.log("Error")
  //   })
  
}

async function getScores(){
  console.log("Getting scores for movies")
  scoresArray = []
  // Get scores for returned movie names
  Array.prototype.forEach.call(movieElements, function(movieName, index) {
    // console.log('Movie ' + index + ' = ' + movieName);
    makeApiCall = true

    if(makeApiCall && !movieName.includes('% on RT')){
      //Search Rotten Tomatoes for Movie
      //console.log('Searcing for movie ' + movieName + ' on RT')
      pageSearchUrl = 'https://www.rottentomatoes.com/napi/search/?limit=1&query=' + encodeURI(movieName);

      sendApiCall(pageSearchUrl).then(result => {
        // console.log("result")
        // console.log(result)
        if(result != null && result.movies != null && result.movies[0] != null){
          movieScore = result.movies[0].meterScore
          //console.log( 'score for ' + movieName + ' = ' + movieScore );
          updateWebsiteWithScore(movieName, movieScore, index)
          //dconsole.log(scoresArray)
        }else{
          console.log('Score not found for ' + movieName );
          //updateWebsiteWithScore(movieScore, index)
        }
      });
      

    }   
  });
  return scoresArray
}

function updateWebsiteWithScore(name, score, index){
  // console.log('Got score');
  // console.log(name);
  // console.log(index);
  // console.log(score);
  var obj = {
    "name": name,
    "score": score,
    "index": index
  }
  // console.log (obj);
  // console.log ( JSON.stringify( obj ) );

  // Update Cineplex.com with rotten tomato scores
  // console.log('Attempting to update Cineplex site with score for '+ name);
  // console.log("TAB QUERY")
  chrome.tabs.query( {url: "*://*.cineplex.com/*", currentWindow: true,active: true}, //, currentWindow: true { active: true },
    function(tabs) {
      //console.log(tabs)
      console.log('Start updating Cineplex site with score for '+ name);
      console.log("TAB ID = "+ tabs[0].id)
      console.log (obj);
      
      chrome.tabs.executeScript(tabs[0].id, {
        file: 'inject.js'
      }, function() {
        chrome.tabs.sendMessage(tabs[0].id, {parameter: obj});
        if (chrome.runtime.lastError) { // or if (!result)
            console.log("ERROR")
            console.log(chrome.runtime.lastError.message)
            return;
        }
      });

      // code_str = 'var info = ' +  JSON.stringify( obj ) + ';';
      // console.log(code_str)

      // chrome.tabs.executeScript(tabs[0].id, {
      //   code: code_str
      // }, function() {

      //   console.log('    running script ' + name)

      //   chrome.tabs.executeScript(tabs[0].id, {
      //     //code: code_str,
      //     file: 'inject.js'
      //   }, function(result) {
      //     if (chrome.runtime.lastError) { // or if (!result)
      //         console.log("ERROR")
      //         console.log(chrome.runtime.lastError.message)
      //         return;
      //     }
      //   });

       // console.log('    completed running script')
      //});

      console.log('Completed updating Cineplex site with score for '+ name);
    }
  );
}

async function sendApiCall(url){
  console.log("making api call for " + url)
  // make async api
  let response = await fetch(url);
  let json = await response.json();
  // console.log("JSON1")
  // console.log(json)
  // console.log("JSON2")

  return json
}

// function getMovieScore(movieName) {

//   makeApiCall = true

//   if(makeApiCall && !movieName.includes('% on RT')){
//     //Search Rotten Tomatoes for Movie
//     chrome.extension.getBackgroundPage().console.log('Searcing for movie ' + movieName + ' on RT')
//     pageSearchUrl = 'https://www.rottentomatoes.com/napi/search/?limit=1&query=' + encodeURI(movieName)
//     //chrome.extension.getBackgroundPage().console.log('URL = ' + pageSearchUrl)

//     // result = fetch(pageSearchUrl).then(r => r.text()).then(result => {

//     // })

//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", pageSearchUrl, true);

//     xhr.onreadystatechange = function () {
//         //console.log(xhr);
//         if (xhr.readyState == 4  && xhr.status == 200) {
//             //console.log(xhr.responseText);
//             var myObj = JSON.parse(xhr.responseText);
//             console.log('response = ' + xhr.responseText)
//             movieScore = myObj.movies[0].meterScore
//             console.log('score in func = ' + movieScore)

//             return movieScore //movieName + ' ('+movieScore+'% on RT)'
//             // response = xhr.responseText['movies'][0]['meterScore']);
//         }
//     }
//     xhr.send();
//   }else{
//     return 80
//   }

  
// }


      // let result = await make_api_call(pageSearchUrl);
      // var xhr = new XMLHttpRequest();
      // xhr.open("GET", pageSearchUrl, true);

      // xhr.onreadystatechange = function () {
      //     if (xhr.readyState == 4  && xhr.status == 200) {
      //     var myObj = JSON.parse(xhr.responseText);
      //     //console.log('response = ' + xhr.responseText)
      //     if(myObj != null && myObj.movies != null && myObj.movies[0] != null){
      //       movieScore = myObj.movies[0].meterScore
      //       console.log( 'score for ' + movieName + ' = ' + movieScore )
      //       scoresArray.push(parseInt(movieScore));
      //       console.log(scoresArray)
      //     }else{
      //       console.log('score not found for ' + movieName )
      //       scoresArray.push(null);
      //     }
      //   }
      // }
      // xhr.send();