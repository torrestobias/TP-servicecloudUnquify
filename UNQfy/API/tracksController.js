const express = require('express');
const ValidateEntry = require("../validate-entry");
const NonExistentObjectException = require('../exceptions/non-existent-object');
const NotANumberException = require('../exceptions/not-a-number');
const WrongArgumentsException = require('../exceptions/wrong-arguments');
const validate = new ValidateEntry();
const tracks = express();
const errors = require("./apiErrors");
const badRequest = new errors.BadRequest();
const resourceNotFound = new errors.ResourceNotFound()
const root = '/tracks';

// GET : Obtiene el album correspondiente al id del parametro.
tracks.get(root + '/:trackId' + '/lyrics', function (req, res) {

    const unqfy = validate.getUNQfy();
    var trackId = 0
    var trackName = ''
    try {
        trackId = validate.parseIntEntry(req.params.trackId);
        trackName = unqfy.getTrackById(trackId).name;
    } catch (e) {
        if (e instanceof WrongArgumentsException ||
            e instanceof NotANumberException) {
            res.status(badRequest.status)
            res.json({
                status: badRequest.status,
                errorCode: badRequest.errorCode
            })
        } else if (e instanceof NonExistentObjectException) { //si el track no existe
            res.status(resourceNotFound.status);
            res.json({
                status: resourceNotFound.status,
                errorCode: resourceNotFound.errorCode
            })
        }
    }
    
    unqfy.getLyrics(trackId)
        .then(lyrics => {
            res.status(200)
            res.json({ name: trackName, lyrics: lyrics });
        })
});

module.exports = { tracks };