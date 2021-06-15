const fs = require('fs');
const { Router } = require('express');
const express = require('express');
const unqmod = require('../unqfy');
const ValidateEntry = require("../validate-entry");
const { send } = require('process');
const app = express();
const router = express.Router();
router.use(express.json());
const bodyParser = require('body-parser');
const { PlayList } = require('../unqfy');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 8000");
})


const root = '/api/playlists';

const validate = new ValidateEntry();

// GET : Obtener una playlist por id.
app.get(root+'/:id', function (req, res) {
    try{
        const unqfy = validate.getUNQfy();
        const playlistId = parseInt(req.params.id);
        const playlist = unqfy.getPlaylistById(playlistId);
        res.status(200)
        res.json({
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


// GET : Obtener una playlist por nombre.
app.get(root, function (req, res) {
    try{
        const unqfy = validate.getUNQfy();
        const name = req.query.name;
        const playlist = unqfy.searchByName(name);
        res.status(200)
        res.json(playlist.playlists);
    }
    catch{
            //Levantar error
        }
  });


// POST : Crea una playlist con máxima duración y tracks pertenecientes a alguno de los géneros.

app.post(root, function (req, res) {
    try{
        let unqfy = validate.getUNQfy();
        let maxDuration = req.body.maxDuration;
        let name = req.body.name;
        let genres = req.body.genres;
        unqfy.createPlaylist(name, genres, maxDuration);
        let playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase()===name.toLowerCase());
        res.status(201);
        res.send(
            {
                "id" : playlist[0].id,
                "name" : playlist[0].name,
                "duration" : playlist[0].maxDuration,
                "tracks" : playlist[0].tracks
            }
        );
    }
    catch{
            //Levantar error
        }
  });



// DELETE : Borrar una Playlist.
app.delete(root+'/:id', function (req, res) {
    try{
        let unqfy = validate.getUNQfy();
        let idPlaylistToDelete = parseInt(req.params.id);
        let playlist = unqfy.getPlaylistById(idPlaylistToDelete);
        unqfy.deletePlaylist({"name" : playlist.name});
        res.json({
            status : 204,
            response : "ok"});
        
    }
    catch{
            //Levantar error
        }
  });
