const express = require('express');
const ValidateEntry = require("../validate-entry");
const NonExistentObjectException = require('../exceptions/non-existent-object');
const validate = new ValidateEntry();
const tracks = express();
const root = '/tracks';
const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();
const relatedResourceNotFound = new errors.RelatedResourceNotFound()

// GET : Obtiene el nombre y lyrics del track correspondiente al id del parametro.
tracks.get(root + '/:trackId' + '/lyrics', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    try {
        var trackId = validate.parseIntEntry(req.params.trackId);
        var trackName = unqfy.getTrackById(trackId).name;
    } catch (e) {
        next(e);
    }
   /*  console.log(unqfy.getLyrics(trackId)) */
    unqfy.getLyrics(trackId)
        .then(lyrics => {
            res.status(200)
            res.json({ name: trackName, lyrics: lyrics });
        })
});

/*
* POST : agrega un track con un nombre y un pais.
*/
tracks.post(root, function (req, res, next) {
    const unqfy = validate.getUNQfy();
    var track = {};
    try {
        validateBody(req.body);
        let name = req.body.name;
        let albumId = validate.parseIntEntry(req.body.albumId);
        console.log(albumId)
        unqfy.addTrack(albumId, { 'name': name, 'genres': req.body.genres, 'duration': req.body.duration });
        validate.saveUNQfy(unqfy, 'data.json');
        track = unqfy.searchTracksByName(name).filter(elem => elem.name.toLowerCase() === name.toLowerCase());
        res.status(201);
        res.send(JSON.stringify(track));
    } catch (e) {
        if (e instanceof NonExistentObjectException) { //si el album no existe
            res.status(relatedResourceNotFound.status)
            res.json({
                status: relatedResourceNotFound.status,
                errorCode: relatedResourceNotFound.errorCode
            })
        } else {
            next(e);
        }
    }
})

function validateBody(body) {
    if (!(body.name && body.genres && (body.duration !== undefined) && (body.albumId !== undefined))) {
        throw badRequest
    }
}

module.exports = { tracks };