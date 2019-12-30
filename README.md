# chrome_extension_rotten_tomatoes_cineplex

Searches for movie names on Cineplex.com webpages by the following class names that are frequently used:
- `movie-details-link-click` found on urls like `https://www.cineplex.com/Showtimes/any-movie/nearby-theatres?Date=12/29/2019`
- `movie-item-title ng-binding` found on urls like `https://www.cineplex.com/`
- `h3 theatre-movie-title margin-vertical-xs` found on urls like `https://www.cineplex.com/Theatre/scotiabank-theatre-toronto`
- `showtime-card--title` found on urls like `https://www.cineplex.com/Movies/NowPlaying?cmpid=MainSubNavEN_now-playing`
- `module-item--title` found on urls like `https://www.cineplex.com/Theatres/UltraAVX`
- `` found on urls like ``

Once a collection of movies names is created, we query Rotten Tomatoes' search API for each one and select the first result (a lazy assumption), pull out the "Tomato Score" and then send it back to the page to add to each instance of the movie name.

Available on the Google Chrome Extension store: https://chrome.google.com/webstore/detail/rotten-tomatoes-on-cinepl/fpjdonkdkbamkgmnbgopjpdeeeoilhfj?hl=en&gl=CA