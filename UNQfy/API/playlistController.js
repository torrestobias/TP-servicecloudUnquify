const express = require('express');
const ValidateEntry = require("../validate-entry");
const NonExistentObjectException = require('../exceptions/non-existent-object');
const validate = new ValidateEntry();
const playlists = express();
const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();
const relatedResourceNotFound = new errors.RelatedResourceNotFound()
const root = '/playlists';

// GET : Obtener una playlist por id.
playlists.get(root + '/:id', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var playlist = {}
    try {
        playlistId = validate.parseIntEntry(req.params.id);
        playlist = unqfy.getPlaylistById(playlistId);
    } catch (e) {
        next(e);
    }
    res.status(200)
    res.json({
        "id": playlist.id,
        "name": playlist.name,
        "duration": playlist.actualDuration,
        "tracks": playlist.tracks
    });
});

// GET : Obtener una playlist por nombre.
playlists.get(root, function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var rta = '';
    try {
        validateQueryParams(req.query);
    } catch (e) {
        next(e);
    }
    if (req.query.name === undefined) {
        rta = unqfy.searchPlaylistByName('');
    } else {
        const name = req.query.name;
        rta = unqfy.searchPlaylistByName(name);
    }
    if (req.query.durationLT !== undefined) {
        rta = rta.filter(playlist => playlist.actualDuration < req.query.durationLT);
    }
    if (req.query.durationGT !== undefined) {
        rta = rta.filter(playlist => playlist.actualDuration > req.query.durationGT);
    }

    res.status(200)
    res.json(rta);
});

// POST : Crea una playlist con máxima duración y tracks pertenecientes a alguno de los géneros.
playlists.post(root, function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var playlist = {};
    if (req.body.genres !== undefined && req.body.maxDuration !== undefined && req.body.name !== undefined) {
        console.log("entrepormaxduration")
        let maxDuration = req.body.maxDuration;
        let name = req.body.name;
        let genres = req.body.genres;
        try {
            unqfy.createPlaylist(name, genres, maxDuration);
            validate.saveUNQfy(unqfy, 'data.json');
            playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
        } catch (e) {
            next(e);
        }
    } else if (req.body.tracks !== undefined && req.body.name !== undefined) {
        console.log("entreportracks")
        let name = req.body.name;
        let temas = req.body.tracks
        try {
            unqfy.createPlaylistFromTracksId(name, temas);
            validate.saveUNQfy(unqfy, 'data.json');
            playlist = unqfy.searchPlaylistByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
        } catch (e) {
            if (e instanceof NonExistentObjectException) { //si el track no existe
                res.status(relatedResourceNotFound.status)
                res.json({
                    status: relatedResourceNotFound.status,
                    errorCode: relatedResourceNotFound.errorCode
                })
            } else {
                next(e);
            }
        }
    } else {
        res.status(400)
        res.json(
            {
                status: 400,
                errorCode: "BAD_REQUEST"
            }
        );
    }
    res.status(201);
    res.json(
        {
            "id": playlist[0].id,
            "name": playlist[0].name,
            "duration": playlist[0].actualDuration, //o maxDuration?
            "tracks": playlist[0].tracks
        }
    );
});

// DELETE : Borrar una Playlist.
playlists.delete(root + '/:id', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    try {
        let idPlaylistToDelete = validate.parseIntEntry(req.params.id);
        let playlist = unqfy.getPlaylistById(idPlaylistToDelete);
        unqfy.deletePlaylist({ "name": playlist.name });
        validate.saveUNQfy(unqfy, 'data.json');
        res.status(204);
        res.json({});
    } catch (e) {
        next(e);
    }
    /*     res.status(204);
        res.json({}); */
});

function validateQueryParams(query) {
    if (!(query.name || query.durationLT || query.durationGT)) {
        throw badRequest
    }
}

module.exports = { playlists };