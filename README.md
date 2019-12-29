# chrome_extension_rotten_tomatoes_cineplex

Searches for movies on Cineplex websites by the following class names that are frequently used:
- `movie-details-link-click` found on urls like `https://www.cineplex.com/Showtimes/any-movie/nearby-theatres?Date=12/29/2019`
- `movie-item-title ng-binding` found on urls like `https://www.cineplex.com/`
- add more?

Once a collection of movies names is created, we query Rotten Tomatoes' search API for each one and select the first result (a lazy assumption), pull out the Tomato Score and then send it back to the page to add to each instance of the movie name.