
const artists = require('./artistController')
const albums = require('./albumsController')
const playlists = require('./playlistController')
const tracks = require('./tracksController')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const router = express.Router();
router.use(express.json());

router.get('/', function (req, res) {
    res.json({ message: 'ruta incorrecta' })
});

app.use('/api', artists.artists, albums.albums, playlists.playlists, tracks.tracks);
app.listen(8000, () => {
    console.log("El servidor está inicializado en el puerto 8000");
})