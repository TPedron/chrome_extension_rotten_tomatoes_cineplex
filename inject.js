// info structure is set when calling inject.js from background

// console.log("Rotten Tomatoes on Cineplex runnning...")

// console.log('info')
// console.log(info);

score = info.score
index = info.index
name = info.name
// console.log(name)
// console.log(index)
// console.log(score)

movieElements = document.getElementsByClassName("movie-details-link-click");

movie = movieElements[index];
//console.log(movie)
if(movie == null){
  console.log("MOVIE IS NULL")
}



if(movie.innerText == name){ //!movie.innerText.includes('% on RT') &&
  newText = movie.innerText + '('+ score+ '% on Rotten Tomatoes)'; 
  console.log(newText)
  movie.innerText = newText;
  //console.log('done')
}



// // info is set whencalling inject.js
// console.log("Rotten Tomatoes on Cineplex runnning...")
// console.log('info')
// console.log(info);

// //if (info.data !== undefined) {
//   // data = JSON.parse(info.data)
//   // console.log('data')
//   // console.log(data);
//   console.log('make scores')
//   scores = info.scores
//   console.log('scores')
//   console.log(scores)

//   console.log("get elements")
//   movieElements = document.getElementsByClassName("movie-details-link-click");
//   console.log(movieElements)

//   console.log('BEGIN')
//   Array.prototype.forEach.call(movieElements, function(movie, index) {
//     console.log('AAAA')
//     console.log(movie)
//     console.log('BBBB')
//     movieName = movie.innerText;
//     console.log('CCCC')
//     console.log('Movie ' + index + ' = ' + movieName);
//     console.log('DDDD')
//     if (scores[index] != null) {
//       console.log('EEEE')
//       new_text = movieName + '('+ scores[index] + '% on Rotten Tomatoes)';
//       console.log('FFFF')
//       console.log(new_text)
//       console.log('GGGG')
//       movie.innerText = new_text;
//       console.log('HHHH')
//     }
//   });
// //}
