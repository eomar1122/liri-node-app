//==============================
// IMPORT PACKAGES
//==============================
require("dotenv").config();
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");

// var liriFirstArg = process.argv[2];
// var nodeArg = process.argv;
// var liriSecondArg = '';

// // Loop through all the words in the node argument
// for (var i = 3; i < nodeArg.length; i++) {
//   if (i > 3 && i < nodeArg.length) {
//     liriSecondArg += ` ${nodeArg[i]}`;
//   }
//   else {
//     liriSecondArg += nodeArg[i];
//   }
// }


//==============================
// MAIN PROCESS
//==============================

inquirer.prompt([
  {
    type: "list",
    name: "first",
    message: "What would you like to search for?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
  },
  {
    type: "input",
    name: "second",
    message: "What is in your mind?"
  }

]).then(function (liri) {
  var liriFirstArg = liri.first;
  var liriSecondArg = liri.second.trim();
  // Check the first argument to decide what function to run
  switch (liriFirstArg) {
    case 'my-tweets':
      getTweets();
      break;

    case 'spotify-this-song':
      songInfo(liriSecondArg);
      break;

    case 'movie-this':
      movieInfo(liriSecondArg);
      break;

    case 'do-what-it-says':
      doWhatItSays();
      break;

      defult:
      console.log("No thing to show! Please check your entries!");
  }
});


//==============================
// FUNCTIONS
//==============================

// Twitter API function to get the last 20 tweets
function getTweets() {

  var client = new Twitter(keys.twitter);
  var params = { screen_name: 'ElshibaniO', count: 20 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      console.log("\n==============================================\n");
      console.log(`------- @${params.screen_name} tweets -------\n`);
      console.log("==============================================\n");
      for (var i = 0; i < tweets.length; i++) {
        console.log(`Created on: ${tweets[i].created_at}\n`);
        console.log(`Tweet content: ${tweets[i].text}\n`)
      }
      console.log("==============================================\n");
    } else if (error) {
      return console.log('Error occurred: ' + error);
    }
  });
}

// Spotify API function to get song information
function songInfo(songName) {

  var spotify = new Spotify(keys.spotify);
  if (songName === '') {
    songName = `What's my age again`;
  }
  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var playlist = data.tracks.items[0];
    // console.log(playlist);

    console.log("\n=================================================\n");
    console.log(`--- Information about ${songName} song ---\n`);
    console.log("=================================================\n");
    console.log(`Artist(s): ${playlist.artists[0].name}\n`);
    console.log(`Song name: ${playlist.name}\n`);
    console.log(`Preview song: ${playlist.preview_url}\n`);
    console.log(`Album: ${playlist.album.name}\n`);
    console.log("=================================================\n");
    // console.log(data);
  });
}


// OMDB API function to get movie information
function movieInfo(movieName) {

  if (movieName === '') {
    movieName = 'Mr Nobody';
  }
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;
  // This line is just to help us debug against the actual URL.
  // console.log(queryUrl);
  // Then create a request to the queryUrl
  request(queryUrl, function (error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Then log the Release Year for the movie
      // console.log(JSON.parse(body));
      console.log("\n==============================================\n");
      console.log(`------- ${movieName} movie information -------\n`);
      console.log("==============================================\n");
      console.log(`Title: ${JSON.parse(body).Title}\n`);
      console.log(`Year: ${JSON.parse(body).Year}\n`);
      console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}\n`);
      console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}\n`);
      console.log(`Country: ${JSON.parse(body).Country}\n`);
      console.log(`Language: ${JSON.parse(body).Language}\n`);
      console.log(`Plot: ${JSON.parse(body).Plot}\n`);
      console.log(`Actors: ${JSON.parse(body).Actors}\n`);
      console.log("==============================================\n");
    } else if (error) {
      return console.log('Error occurred: ' + error);
    }
  });
}

// Do what it says function
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // Split the arguments
    var dataArr = data.split(",")
    // Remove the double quotes from string the second argument
    dataArr[1] = dataArr[1].substring(1, dataArr[1].length - 1);
    // console.log(dataArr[1]);

    switch (dataArr[0]) {
      case 'my-tweets':
        getTweets();
        break;

      case 'spotify-this-song':
        songInfo(dataArr[1]);
        break;

      case 'movie-this':
        movieInfo(dataArr[1]);
        break;
        defult:
        console.log("No thing to show! Please check your entries!")
    }
  });
}