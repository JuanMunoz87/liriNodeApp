// Require npm to link the keys
require("dotenv").config();

// Variables require
var fs = require("fs");
var keys = require("./keys.js");
var axios = require('axios');
var moment = require("moment")
//var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//variables
var command = process.argv[2];
var arg = process.argv;
var reference = [];
var theSong = "";
var theMovie ="";
var theBand ="";
var fileName = "log.txt";
var fullCommand = [];

// Making a reference ffor user choice to accept several words.
for (var i = 3; i < arg.length; i++){
  reference.push(arg[1])
}

var referenceBand = reference.join("");

//logging command.
fullCommand.push(command);
if(reference.length != 0){
  fullCommand.push(referenceBand);
}

//Function logging 
function logging(value){
  fs.appendFile(fileName, '' + value, function(err){
    if(err){
      return console.log('oh no error')
    }
  })
}
logging(fullCommand);

// liris command.
  //`concert-this`------
  //`spotify-this-song`
  //`movie-this`
  //`do-what-it-says`-----

//Commands
if (command === "concert-this"){
  concert(referenceBand);
}
else if(command === "spotify-this-song"){
  spotifySong(reference);
}
else if(command === "movie-this"){
  movie(reference);
}
else if(command === "do-what-it-says"){
  doThat();
}


//Function-`concert-this`
function concert(referenceBand){
  var bandUrl = "https://rest.bandsintown.com/artists/" + referenceBand + "/events?app_id=87asef9998";
  axios.get(bandUrl).then(
    function (response){
      console.log("");
      console.log("Band and Artist Information: " + referenceBand + " ");
      for (var i = 0; i < response.data.length; i++){
        var datetime = response.data[i].datetime;
        var dateArr = datetime.split('T');
        var concertResults =
        " "+
        "\nVenue Name: " + response.data[i].venue.name +
        "\nVenue Location: " + response.data[i].venue.city +
        "\nEvent Date: " + moment(dateArr[0], "YYYY-DD-MM").format("DD-MM-YYYY");
        console.log(concertResults);
      }console.log("");
      console.log(" ");
    })
    .catch(function (error){
      console.log('This is the error: ' + error);
    });
}

  //`spotify-this-song`
  function spotifySong(reference){
    if(reference.length === 0){
      reference = "Sign In";
    }
    spotify
    .search({ type: 'track', query: reference})
    .then(function(response){
      console.log(" ");
      console.log("Spotify " + reference + " ");
      console.log(" ");
      for (var i = 0; i < 5; i++){
        var spotifyResults =
        " " +
        "\nArtist(s): " + response.tracks.items[i].artists[0].name +
        "\nSong Name: " + response.tracks.items[i].name +
        "\nAlbum Name: " + response.tracks.items[i].album.name +
        "\nPreview Link: " + response.tracks.items[i].preview_url;
        
        console.log(spotifyResults);
      }
      console.log(" ");
      console.log("======");
      console.log(" ");
    })
    .catch(function(err){
      console.log(err);
    });
  }


//Function - `movie-this`
function movie(reference){
  if(reference.length === 0){
    reference = "mr nobody"
  }
  axios.get('http://www.omdbapi.com/?t=' + reference + '&plot=short&apikey=87fe8999').then(
  .then(function(response){
    var rotten = response.data.Ratings[1]
    if (rotten === undefined){rotten = 'Not available'}
    else{rotten = response.data.Ratings[1].value;}
    console.log("");
    console.log("Movie Information" + response.data.Title + "");
    console.log("");

    var movieResults = 
    "\n  Title: " + response.data.Title +
    "\n  Year: " + response.data.Year +
    "\n  IMDB Rating: " + response.data.Rated +
    "\n  Country: " + response.data.Country +
    "\n  Language: " + response.data.Language +
    "\n  Plot: " + response.data.Plot +
    "\n  Actors: " + response.data.Actors +
    "\n  Rotten Tomatoes Rating: " + rotten + 
    "\n" +
    "\n*************** " +
    "\n" ;
console.log(movieResults);
})
.catch(function(error){
  console.log("This is the error: " + error)
});
}

//function-do-what-it-says
function DoWhatItSays(){
  fs.readFile("random.txt", "utf8", function(error,data){
    if (error){
      return console.log(error);
    }
    var dataArr = data.split(',');
    console.log('')
    console.log('CONTENT MENU')
    console.log('')
    for (var i = 0; i < dataArr.length; i++){
    if (dataArr[i] == 'spotify-this-song'){
      theSong = dataArr[++i];
      console.log('spotifying' + theSong + '')
      spotifySong(theSong);
    }
    else if (dataArr[i] === 'movie-this'){
      theMovie = dataArr[++i];
      console.log('Watch this movie' + theMovie + '' )
      movie(theMovie);
    }
    else if (dataArr[i] === 'concert-this'){
      theBand = dataArr[++i];
      console.log('Check this band' + theBand + '' )
      concert(theBand);
    }
    else { console.log("command not accepted");
    }
  }
  })

}


