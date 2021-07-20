const artists = require('./artistController')
const albums = require('./albumsController')
const playlists = require('./playlistController')
const tracks = require('./tracksController')
const express = require('express');
const app = express();  
const bodyParser = require('body-parser');
const errors = require("./apiErrors");
const resourceNotFound = new errors.ResourceNotFound();
const {errorHandlerF} = require('./errorHandler')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const router = express.Router();
router.use(express.json());

const NEWSLETTER_API_HOST = process.env["NEWSLETTER_API_HOST"] || 'http://localhost:5001';
const LOGGING_API_HOST = process.env["LOGGING_API_HOST"] || 'http://localhost:5002';
const MONITOR_API_HOST = process.env["MONITOR_API_HOST"] || 'http://localhost:5003';

app.use('/api', artists.artists, albums.albums, playlists.playlists, tracks.tracks);
app.get('/ping', (req, res) => {
    console.log('ping arrived!');
    res.json({ message: "pong" });
});
app.use(errorHandlerF);
app.all('*', function (req, res, next) {
    res.status(resourceNotFound.status)
    res.json({
        status: resourceNotFound.status,
        errorCode: resourceNotFound.errorCode
    })
});

app.listen(5000, () => {
    console.log("El servidor está inicializado en el puerto 5000");
})