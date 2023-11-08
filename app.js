require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Setting up the Spotify API goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

// 1.  ROUTE TO RENDER THE FORM "/" estas rutas son para que funcionen los archivos en el browser, sino no tenemos acceso

app.get("/", (req, res) => {
  res.render("form")
})


//2.   ROUTE TO DISPLAY THE RESULTS "/artist-results"

app.get("/artist-search", (req, res) => {
  const artistName = req.query.artistName // aqui paso el "name" del form donde pongo el artista. recogo la informacion del formulario de entrad.a
  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      const artistResults = data.body.artists.items
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-results", {artistResults})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})
