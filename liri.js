// require("dotenv").config();

// var keys = require("./keys.js");

// // Spotify

// var Spotify = require('node-spotify-api');

// // Moment
// var moment = require("moment");

// // Axios
// var axios = require("axios");

// var spotify = new Spotify(keys.spotify);



// // try switch below
// var main = function(liri_request, liri_search_term){
//     switch (liri_request) {
//         case "concert-this":

//     // BIT aapi taking in artist search
//     var artist = liri_search_term.split(" ").join("+")

//     // search url below

//     var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

//     // axios is used below

//     axios

//     .get(url)
//     .then(function(response){
//         console.log("Check out these concerts for", liri_search_term, ":")
//         const res = response.data;
//         res.array.forEach(event => {
//           console.log("\n++++_____+++\n") 
//           console.log(event.venue.name);
//           console.log(event.venue.city, event.venue.region, event.venue.country)
//           console.log(moment(event.datetime).format("dddd, MMMM DD YY, h:mm a")) 
//         });
//     })
//     .catch(function (error){
//         console.log(error);
//     })
//     }
// }


require("dotenv").config();

var keys = require("./keys.js");

// axios
var axios = require("axios");

// spotify

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


//moment 
var fs = require('fs');

var moment = require("moment");





// switch
var main = function (liri_request, liri_search_term) {
    switch (liri_request) {
        case "concert-this":

            // users use bands in town to search for artist's concerts

            var artist = liri_search_term.split(" ").join("+")
            // create the url
            var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
            // start axios
            axios
                .get(url)
                .then(function (response) {
                    console.log("Here are some upcomming shows for", liri_search_term, ":")
                    const res = response.data;
                    res.forEach(event => {
                        console.log(moment(event.datetime).format("dddd, MMMM DD YYYY, h:mm a"))
                        console.log(event.venue.name);
                        console.log(event.venue.city, event.venue.region, event.venue.country)
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })

            break;
        case "spotify-this-song":
            // users can search for a spotify song

            // default search term is a class 1960s song by band Buffalo Springfield
            if (!liri_search_term) {
                liri_search_term = "For What It's Worth"
            }
            spotify
                .search(
                    {
                        type: 'track', query: liri_search_term
                    }).then(function (response) {
                        console.log("Some groovy tunes for you, :", liri_search_term)
                        const res = response.tracks.items[0];

                        let artist = []
                        res.artists.forEach(element => {
                            artist.push(element.name)
                        });
                        console.log('Song Title:', res.name)
                        console.log('Artist:', artist.join(', '))
                        console.log('Link:', res.external_urls.spotify)
                        console.log('Album Name:', res.album.name)

                    }
                    )
                .catch(function (err) {
                    console.log(err);
                });


            break;
        case "movie-this":

            // omdb movie search
            // setting default movie to Old School
            var movie = "Old School"
            if (liri_search_term) {
                movie = liri_search_term.split(" ").join("+")
            }
            // create the url
            var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie
            // start axios
            axios
                .get(url)
                .then(function (response) {
                    console.log(liri_search_term, " is a classic, check out more info here: ")
                    const res = response.data;
                    // res.forEach(event => {
                    // console.log("\n++++____++++\n");
                    console.log(res.Title);
                    console.log(res.Year);
                    console.log(res.Ratings[0].Source, res.Ratings[0].Value);
                    console.log(res.Ratings[1].Source, res.Ratings[1].Value);
                    console.log(res.Country);
                    console.log(res.Language);
                    console.log(res.Plot);
                    console.log(res.Actors)
                    // console.log("\n++++____++++\n");

                })
                .catch(function (error) {
                    console.log(error);
                })
            break;
        // recursion used below
        case "do-what-it-says":
            fs.readFile('random.txt', 'utf8', (err, data) => {
                if (err) { return console.log(err) }
                var firstSplit = data.split('\n') 
                var secSplit = []
                firstSplit.forEach(element => {
                    secSplit.push(element.replace(/"/g, '').split(','))
                })
                // console.log(data)
                // console.log(firstSplit)
                secSplit.forEach(element => {
                    // console.log(element[0],element[1])
                    main(element[0], element[1])
                });
            })
            break;

        // default case 


        default:
            console.log("\n\nThis program takes in two arguements:\n\nThe first is a command such as concert-this. The second is a search term for the command. So a proper example is: \n\n node liri concert-this 'red hot chili peppers' \n\n")
            break;
    }
}
main(process.argv[2],process.argv[3])

