const fs = require('fs');
const { Router } = require('express');
const express = require('express');
const unqmod = require('../unqfy');
const {getUNQfy} = require("../validate-entry");
const { send } = require('process');
const app = express();
const router = express.Router();
router.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 8000");
})


const root = '/api/playlists';



// GET : Obtener una playlist.
app.get(root+'/:id', function (req, res) {
    try{
        const unqfy = getUNQfy();
        const playlistId = parseInt(req.params.id);
        const playlist = unqfy.getPlatlistById(playlistId);
        res.status(200)
        res.send(JSON.stringify(playlist));
    }
    catch{
            //Levantar error
        }
  });




// POST : Crea una playlist con máxima duración y tracks pertenecientes a alguno de los géneros.

app.post(root, function (req, res) {
    try{
        let unqfy = getUNQfy();
        let maxDuration = req.body.maxDuration;
        let name = req.body.name;
        let genres = req.body.genres;
        unqfy.createPlaylist(name, genres, maxDuration);
        let playlist = unqfy.searchPlaylistByName(name);
        res.status(201);
        res.send({
            "id" : playlist.id,
            "name" : playlist.name,
            "duration" : playlist.maxDuration,
            "tracks" : playlist.tracks
        });
    }
    catch{
            //Levantar error
        }
  });



// DELETE : Borrar una Playlist.
app.delete(root+'/:id', function (req, res) {
    try{
        let unqfy = getUNQfy();
        let idPlaylistToDelete = parseInt(req.params.id);
        let playlist = unqfy.getPlaylistById(idPlaylistToDelete);
        unqfy.deletePlaylist({"name" : playlist.name});
        res.status(204);
    }
    catch{
            //Levantar error
        }
  });
