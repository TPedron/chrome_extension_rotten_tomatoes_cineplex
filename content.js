chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  sendResponse(getMovieNames(request.args));
});

function getMovieNames(){}
  console.log("Get Movie Names")
  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'document.getElementsByClassName("movie-details-link-click");' }
    )
  });
}
