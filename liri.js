//Variables for requiring npm packages
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
//var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");

//Variable to take commands
var command = process.argv[2];

//Makes multiple word arguments possible
var term = process.argv.slice(3).join(" ");




//All spotify functionality
//node liri.js spotify-this-song '<song name here>' should return artist, the song's name, preview link from spotify, the album the song is in
//If no song provided default to "The Sign" by Ace of Base

var spotify = new Spotify(keys.spotify);


function spotifySong() {
    if (!term) {
        term = "The Sign";
    }

    console.log("Song: " + term);
    spotify.search(
        {
            type: "track",
            query: term,
            limit: 10
        },
        function (err, response) {
            if (err) {
                console.log(err);

            }

            var songs = response.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("Artist(s): " + songs[i].artists[0].name);
                console.log("Song Name: " + songs[i].name);
                console.log("Album: " + songs[i].album.name);
                console.log("Preview Link: " + songs[i].preview_url);
                console.log("--------------------------------------------");

                var string = songs[i].artists[0].name + "\n" + songs[i].name + "\n" + songs[i].album.name + "\n" + songs[i].preview_url;

                fs.appendFile("log.txt", string + "\n", function (err) {
                    if (err) {
                        console.log(err);
                        return err;
                    }
                });

            }


        })
}



//OMDB functionality
//node liri.js movie-this '<movie name here>' should return title of the movie, year, IMDB rating, roten tomatoes rating, counrty produced in, language, plot, and actors
//If no move typed in default to "Mr.Nobody"
function omdb() {

    if (!term) {
        term = "Mr.Nobody";
        console.log("If you haven't watched " + "Mr. Nobody," + " then you should: http://www.imdb.com/title/tt0485947/");
        console.log("Its on Netflix!");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";
    //Axios
    axios.get(queryUrl).then(function (response) {

        var response = response.data;
        var breaker = "----------------------------";
        console.log(breaker);
        console.log("Title: " + response.Title);
        console.log(breaker);
        console.log("Year: " + response.Year);
        console.log(breaker);
        console.log("IMDB Rating: " + response.imdbRating);
        console.log(breaker);
        console.log("Country: " + response.Country);
        console.log(breaker);
        console.log("Language: " + response.Language);
        console.log(breaker);
        console.log("Plot: " + response.Plot);
        console.log(breaker);
        console.log("Actors: " + response.Actors);

        var string = response.Title + "\n" + response.Year + "\n" + response.imdbRating + "\n" + response.Country + "\n" + response.Language + "\n" + response.Plot + "\n" + response.Actors;

        fs.appendFile("log.txt", string, function (err) {
            if (err) {
                throw err;
            }
            console.log("Saved!");
        });

    })
}





//node liri.js concert-this <artist/band name here> should return name of venue, location, and date with moment js

function concert() {

    var queryUrl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";

    //Axios
    axios.get(queryUrl)
        .then(
            function (response) {
                var response = response.data;
                var breaker = "----------------------------"
                //console.log(response.data);
                for (var i = 0; i < response.length; i++) {
                    console.log(breaker);
                    console.log("Artist: " + response[i].lineup[0]);
                    console.log(breaker);
                    console.log("Name of venue: " + response[i].venue.name);
                    console.log(breaker);
                    console.log("Venue location: " + response[i].venue.city);
                    console.log(breaker);
                    console.log("Event date: " + moment(response.datetime).format("MM/DD/YYYY"));
                    console.log(breaker);

                    var string = response[i].lineup[0] + "\n" + response[i].venue.name + "\n" + response[i].venue.city + "\n" + moment(response.datetime).format("MM/DD/YYYY");

                    fs.appendFile("log.txt", string, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })

                }
            }
        )
};


//Function for command do-what-it-says

function doSomething() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        }
        var dataArr = data.split(",");

        command = dataArr[0];
        term = dataArr[1];

        userCommand(command, term);
    });
}



//Make liri take in concert-this, spotify-this-song, movie-this, do-what-it-says
//Cases to change functions from command

function userCommand(command, term) {
    switch (command) {
        case "concert-this":
            concert();
            break;

        case "spotify-this-song":
            spotifySong(term);
            break;

        case "movie-this":
            omdb();
            break;

        case "do-what-it-says":
            doSomething();
            break;

        default:
            console.log("Please enter a command.");

    }
}

userCommand(command, term);