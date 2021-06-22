const express = require('express');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const playlists = express();
const root = '/playlists';

// GET : Obtener una playlist por id.
playlists.get(root + '/:id', function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const playlistId = parseInt(req.params.id);
        const playlist = unqfy.getPlaylistById(playlistId);
        res.status(200)
        res.json({
            "id": playlist.id,
            "name": playlist.name,
            "duration": playlist.maxDuration,
            "tracks": playlist.tracks
        });
    }
    catch {
        //Levantar error
    }
});

// GET : Obtener una playlist por nombre.
playlists.get(root, function (req, res) {
    try {
        const unqfy = validate.getUNQfy();
        const name = req.query.name;
        const playlist = unqfy.searchByName(name);
        res.status(200)
        res.json(playlist.playlists);
    }
    catch {
        //Levantar error
    }
});
/*
// POST : Crea una playlist con máxima duración y tracks pertenecientes a alguno de los géneros.
playlists.post(root, function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let name = req.body.name;
        let temas= req.body.tracks
        let tracks = unqfy.getTracksFromListOfIdTracks(temas)
        let maxDuration = unqfy.getDurationFromListOfTracks(tracks);
        let genres = unqfy.getGenresFromListOfTracks(tracks);
        unqfy.createPlaylist(name, genres, maxDuration);
        let playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
        res.status(201);
        res.send(
            {
                "id": playlist[0].id,
                "name": playlist[0].name,
                "duration": playlist[0].maxDuration,
                "tracks": playlist[0].tracks
            }
        );
    }
    catch {
        //Levantar error
    }
});*/


playlists.post(root, function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        if (req.body.genres !== undefined && req.body.maxDuration !== undefined && req.body.name !== undefined) {
            console.log("entrepormaxduration")
            let unqfy = validate.getUNQfy();
            let maxDuration = req.body.maxDuration;
            let name = req.body.name;
            let genres = req.body.genres;
            unqfy.createPlaylist(name, genres, maxDuration);
            let playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
            res.status(201);
            res.send(
                {
                    "id": playlist[0].id,
                    "name": playlist[0].name,
                    "duration": playlist[0].actualDuration, //o maxDuration?
                    "tracks": playlist[0].tracks
                }
            );
        }
        else if (req.body.tracks !== undefined && req.body.name !== undefined) {
            console.log("entreportracks")
            let name = req.body.name;
            let temas = req.body.tracks
            let tracks = unqfy.getTracksFromListOfIdTracks(temas)
            let maxDuration = unqfy.getDurationFromListOfTracks(tracks);
            let genres = unqfy.getGenresFromListOfTracks(tracks);
            unqfy.createPlaylist(name, genres, maxDuration);
            let playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
            res.status(201);
            res.send(
                {
                    "id": playlist[0].id,
                    "name": playlist[0].name,
                    "duration": playlist[0].actualDuration, //o maxDuration?
                    "tracks": playlist[0].tracks
                }
            );
        }
        else {
            res.status(404)
            res.send("los datos ingresados son insuficientes");
        }
    }
    catch {
        res.json(error.name)
    }
});

// DELETE : Borrar una Playlist.
playlists.delete(root + '/:id', function (req, res) {
    try {
        let unqfy = validate.getUNQfy();
        let idPlaylistToDelete = parseInt(req.params.id);
        let playlist = unqfy.getPlaylistById(idPlaylistToDelete);
        unqfy.deletePlaylist({ "name": playlist.name });
        res.json({
            status: 204,
            response: "ok"
        });

    }
    catch {
        //Levantar error
    }
});

module.exports = { playlists };